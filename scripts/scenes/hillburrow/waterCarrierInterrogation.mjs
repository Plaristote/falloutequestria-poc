import {SceneManager} from "../../behaviour/sceneManager.mjs";

export class WaterCarrierInterrogationScene extends SceneManager {
  constructor(parent) {
    super(parent, "water-carrier-interrogation");
  }

  get waterCarrier() {
    return game.getCharacter("hillburrow/water-carrier");
  }

  get potiokBoss() {
    return level.findObject("boss");
  }

  get guardA() {
    return level.findObject("guards.day-shift.mercenary#3");
  }

  get guardB() {
    return level.findObject("guards.day-shift.mercenary#4");
  }

  get actors() {
    return [
      this.waterCarrier,
      this.potiokBoss,
      this.guardA,
      this.guardB
    ]
  }

  get states() {
    return [
      this.start.bind(this),
      this.introduction.bind(this),
      this.intimidation.bind(this),
      this.interrogation.bind(this),
      this.confession.bind(this),
      this.murder.bind(this),
      this.orderBodyDisposal.bind(this),
      this.disposeOfBody.bind(this)
    ];
  }

  start() {
    const self = this;
    const zone = level.findGroup("house.office").controlZone;

    game.asyncAdvanceTime(5, function() {
      game.uniqueCharacterStorage.loadCharacterToZone("hillburrow/water-carrier", zone);
      [game.player, self.guardA, self.guardB].forEach(character => {
        level.moveCharacterToZone(character, zone);
      });
      self.guardA.script.guardComponent.disable();
      self.guardB.script.guardComponent.disable();
      self.triggerNextStep();
    });
  }

  introduction() {
    const actions = this.potiokBoss.actionQueue;

    this.waterCarrier.lookAt(this.potiokBoss);
    actions.pushWait(1);
    actions.pushLookAt(this.waterCarrier);
    actions.pushSpeak(this.line("introduction"), 8000, "yellow");
    actions.pushWait(5);
    actions.pushScript(this.triggerNextStep.bind(this));
    actions.start();
  }

  intimidation() {
    console.log("INTIMIDATION STEP STARTED");
    this.intimidationWith(this.guardA);
    this.intimidationWith(this.guardB, this.triggerNextStep.bind(this));
  }

  intimidationWith(guard, callback) {
    const actions = guard.actionQueue;
    const self = this;

    console.log("intiidationWith", guard)
    actions.pushReach(this.waterCarrier);
    actions.pushInteraction(this.waterCarrier, "use");
    actions.pushScript({
      onTrigger: function() {
        if (self.waterCarrier.statistics.hitPoints < 20)
          self.waterCarrier.statistics.hitPoints += 10;
        self.waterCarrier.takeDamage(10, null);
        if (callback)
          callback();
      },
      onCancel: function() {
        console.log("Intimidation failed, state is", self.state);
        if (self.state === 2)
          self.intimidationWith(guard);
      }
    });
    actions.start();
  }

  interrogation() {
    const actions = this.potiokBoss.actionQueue;

    this.waterCarrier.lookAt(this.potiokBoss);
    this.potiokBoss.lookAt(this.waterCarrier);
    actions.pushWait(1);
    actions.pushSpeak(this.line("interrogation"), 8000, "red");
    actions.pushWait(5);
    actions.pushScript(this.triggerNextStep.bind(this));
    actions.start();
  }

  confession() {
    const actions = this.waterCarrier.actionQueue;

    this.waterCarrier.lookAt(this.potiokBoss);
    actions.pushSpeak(this.line("confession"), 8000, "lightgreen");
    actions.pushWait(5);
    actions.pushScript(this.triggerNextStep.bind(this));
    actions.start();
  }

  murder() {
    const actions = this.potiokBoss.actionQueue;
    const self = this;

    if (!this.murderLineSaid) {
      this.murderLineSaid = true;
      actions.pushSpeak(this.line("murder-A"), 4000, "white");
      actions.pushWait(2);
    }
    actions.pushReach(this.waterCarrier);
    actions.pushWait(1);
    actions.pushSpeak(this.line("murder-B"), 4000, "red");
    actions.pushScript({
      onTrigger: function() {
        self.waterCarrier.takeDamage(self.waterCarrier.statistics.hitPoints + 1, null);
        self.triggerNextStep();
      },
      onCancel: function() { self.murder(); }
    });
    actions.start();
  }

  orderBodyDisposal() {
    const actions = this.potiokBoss.actionQueue;

    actions.pushMovement(24, 32);
    actions.pushLookAt(this.guardA);
    actions.pushSpeak(this.line("orderBodyDisposal"), 8000, "yellow");
    actions.pushScript(this.triggerNextStep.bind(this));
    actions.start();
  }

  disposeOfBody() {
    const self = this;

    game.asyncAdvanceTime(5, function() {
      level.deleteObject(self.waterCarrier);
      level.initializeDialog(self.potiokBoss, "hillburrow/potiok-boss", "sabotage/accusation/water-carrier/about-bibin");
      // Should not be needed if advancing time for NPCs worked correctly
      //level.moveCharacterToZone(self.guardA, "house-front");
      //level.moveCharacterToZone(self.guardB, "house-front");
    });
    self.triggerNextStep();
  }

  onDamageTaken(character, dealer) {
    if (dealer == game.player) {
      this.waterCarrier.setAsEnemy(this.potiokBoss);
      this.potiokBoss.setAsEnemy(game.player);
      this.finalize();
    }
  }

  finalize() {
    this.guardA.script.guardComponent.enable();
    this.guardB.script.guardComponent.enable();
    super.finalize();
  }
}
