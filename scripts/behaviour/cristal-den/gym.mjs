import {RoutineComponent} from "../routine.mjs";

export class Gym {
  constructor(model) {
    this.model = model;
    this.routineComponent = new RoutineComponent(this, [
      {hour: "22", minute: "01", callback: "startMatches"},
      {hour: "02", minute: "00", callback: "stopMatches" }
    ]);
    this.routineComponent.refreshInterval = 20180;
  }

  initialize() {
    this.routineComponent.updateRoutine();
  }

  get openForMatches() {
    return this.model.tasks.hasTask("scheduleNpcMatch");
  }

  get canPlayerJoinCombat() {
    return !this.combatOngoing && this.routineComponent.getCurrentRoutine().callback == "startMatches";
  }

  get ringZone() {
    return level.getTileZone("ring");
  }

  get ringExitZone() {
    return level.getTileZone("ring-exit");
  }

  get referee() {
    return this.model.findObject("boxing-manager");
  }

  get boxers() {
    return this.model.find("boxer-*").filter(function(character) {
      return character.isAlive();
    });
  }

  get ringCharacters() {
    const blacklist = [game.player, this.referee];

    return level.getZoneOccupants(this.ringZone).filter(function(character) {
      return character.type == "Character" && blacklist.indexOf(character) < 0;
    });
  }

  set combatOngoing(value) {
    this.model.setVariable("combat", value ? 1 : 0);
  }

  get combatOngoing() {
    return this.model.getVariable("combat", 0) == 1;
  }

  set combatWinner(value) {
    this.model.setVariable("winner", value.path);
  }

  get combatWinner() {
    return level.findObject(this.model.getVariable("winner"));
  }

  get nextNpcFighters() {
    return [
      level.findObject(this.model.getVariable("npcFighterA")),
      level.findObject(this.model.getVariable("npcFighterB"))
    ];
  }

  set nextNpcFighters(characters) {
    this.model.setVariable("npcFighterA", characters[0].path);
    this.model.setVariable("npcFighterB", characters[1].path);
  }

  placeBet(fighter, amount) {
    this.model.setVariable("betOn", fighter.path);
    this.model.setVariable("betAmount", amount);
    this.model.setVariable("betSolved", 0);
    this.model.setVariable("betWon", 0);
  }

  startMatches() {
    this.model.tasks.addUniqueTask("scheduleNpcMatch", 30000, 0);
  }

  stopMatches() {
    this.model.tasks.removeTask("scheduleNpcMatch");
  }

  scheduleNpcMatch() {
    let candidates = this.boxers;

    console.log("Start match triggered", this.combatOngoing, candidates.length > 2);
    if (!this.combatOngoing && candidates.length > 2) {
      const combattants = [];

      while (combattants.length < 2) {
        const i = Math.floor(Math.random() * candidates.length);
        combattants.push(candidates[i]);
        candidates.splice(i, 1);
      }
      this.combatOngoing = true;
      this.nextNpcFighters = combattants;
      this.model.tasks.addUniqueTask("startNpcCombat", 30000, 1);
    }
  }

  startNpcCombat() {
    if (!this.model.tasks.hasTask("npcCombatTick")) {
      const combattants = this.nextNpcFighters;
      level.moveCharacterToZone(combattants[0],   "ring-entry-A", 2);
      level.moveCharacterToZone(combattants[1],   "ring-entry-B", 2);
      level.moveCharacterToZone(this.referee, "ring-entry-C", 2);
      combattants.forEach(combattant => { combattant.statistics.hitPoints = combattant.statistics.maxHitPoints; });
      this.combatPresentation(combattants[0], combattants[1]);
    }
  }

  combatPresentation(characterA, characterB) {
    const actions = this.referee.actionQueue;
    const self = this;

    actions.reset();
    actions.pushSpeak(i18n.t("cristal-den.ring.combat-introduction-1"), 3000, "white");
    actions.pushWait(3);
    actions.pushSpeak(i18n.t("cristal-den.ring.combat-introduction-2", {
      name1: characterA.statistics.name,
      name2: characterB.statistics.name
    }), 4000, "white");
    actions.pushWait(4);
    actions.pushSpeak(i18n.t("cristal-den.ring.combat-introduction-3"), 3500, "white");
    actions.start();
    this.model.tasks.addTask("npcCombatTick", 3000 + 4000 + 3500, 1);
  }

  npcCombatTick() {
    const combattants = this.ringCharacters;
    const it = Math.floor(Math.random() * 2);

    if (combattants.length > 1) {
      this.npcCombatAction(combattants[it], it == 0 ? combattants[1] : combattants[0]);
      this.model.tasks.addTask("npcCombatTick", 1840, 1);
    }
  }

  npcCombatAction(character, target) {
    const actions = character.actionQueue;

    actions.reset();
    actions.pushReach(target);
    actions.pushLookAt(target);
    actions.pushAnimation("melee");
    actions.pushScript(this.npcOnCombatAction.bind(this, character, target));
    actions.start();
  }

  npcOnCombatAction(character, target) {
    const hpLeft = target.statistics.hitPoints;

    if (hpLeft > 15)
      target.takeDamage(character.statistics.meleeDamage + Math.ceil(Math.random() * 3), null);
    else {
      target.addBuff("ko");
      this.model.tasks.removeTask("npcCombatTick");
      this.model.tasks.addTask("npcCombatEnd", 1515, 1);
      this.combatWinner = character;
    }
  }

  npcCombatEnd() {
    const actions = this.referee.actionQueue;
    const self = this;

    actions.pushReach(this.combatWinner);
    actions.pushSpeak(i18n.t("cristal-den.ring.combat-ending-part-0"), 5000, "white");
    actions.pushWait(5);
    actions.pushSpeak(i18n.t("cristal-den.ring.combat-ending-part-1", {name: this.combatWinner.statistics.name}), 5000, "white");
    actions.pushWait(5);
    actions.pushScript({
      onTrigger: this.finalizeCombat.bind(this),
      onCancel: function() { self.model.tasks.addTask("npcCombatEnd", 1515, 1); }
    });
    actions.start();
    if (this.model.getVariable("betSolved", 1) == 0) {
      this.model.setVariable("betWon", this.combatWinner.path == this.model.getVariable("betOn"))
      this.model.setVariable("betSolved", 1);
    }
  }

  finalizeCombat() {
    level.setCharacterPosition(this.referee, 9, 21, 2);
    this.ringCharacters.forEach(character => {
      level.moveCharacterToZone(character, this.ringExitZone);
    });
    this.combatOngoing = false;
    this.scheduleNpcMatch();
  }
}
