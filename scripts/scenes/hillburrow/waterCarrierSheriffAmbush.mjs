import {SceneManager} from "../../behaviour/sceneManager.mjs";
import {startOldSheriffVengeance} from "../../quests/hillburrow/oldSheriffMurder.mjs";

export class WaterCarrierSheriffAmbushScene extends SceneManager {
  constructor(parent) {
    super(parent, "water-carrier-sheriff-ambush");
  }

  get waterCarrier() {
    return game.getCharacter("hillburrow/water-carrier");
  }

  get sheriff() {
    return game.getCharacter("hillburrow/sheriff");
  }

  get actors() {
    return [
      this.waterCarrier,
      this.sheriff
    ];
  }

  get states() {
    return [
      this.start.bind(this),
      this.speech1.bind(this),
      this.speech2.bind(this),
      this.startFight.bind(this)
    ];
  }

  start() {
    const self = this;
    const zone = level.getZoneFromName("vengeance-scene");

    startOldSheriffVengeance();
    game.uniqueCharacterStorage.loadCharacterToZone("hillburrow/sheriff", zone);
    game.asyncAdvanceToHour(1, 6, function() {
      game.uniqueCharacterStorage.loadCharacterToCurrentLevel("hillburrow/water-carrier", 28, 5);
      self.triggerNextStep();
    });
  }

  speech1() {
    this.dialogLineStep({
      speaker: this.waterCarrier,
      target: this.sheriff,
      line: this.line("water-carrier-intro"),
      duration: 3.5,
      color: "yellow"
    });
  }

  speech2() {
    this.dialogLineStep({
      speaker: this.sheriff,
      target: this.waterCarrier,
      line: this.line("sheriff-intro"),
      duration: 1,
      bubbleDuration: 4,
      color: "red"
    });
  }

  startFight() {
    this.waterCarrier.statistics.faction = "";
    this.waterCarrier.setAsEnemy(this.sheriff);
    this.waterCarrier.fieldOfView.setEnemyDetected(this.sheriff);
    this.sheriff.setAsEnemy(this.waterCarrier);
    this.sheriff.fieldOfView.setEnemyDetected(this.waterCarrier);
    this.finalize();
  }

  onDamageTaken(character, dealer) {
    if (this.actors.indexOf(character) >= 0)
      this.startFight();
  }

  finalize() {
    super.finalize();
  }
}
