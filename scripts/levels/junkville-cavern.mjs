import {getValueFromRange} from "../behaviour/random.mjs";
import {AcidZoneEffect} from "./components/acidZoneEffect.mjs";
import {HelpfulRescueScene} from "../scenes/junkville/helpfulRescue.mjs";
import {
  helpfulHasDisappeared,
  helpfulExitCavernHook,
  findHelpfulRescueRouteState
} from "../quests/junkville/findHelpful.mjs";

export class Level {
  constructor(model) {
    this.model = model;
    this.acidZone = new AcidZoneEffect(this, {
      zone: level.tilemap.getZone("acid-zone"),
      scope: "acidZone", interval: 3000
    });
  }

  initialize() {
    this.acidZone.enable();
  }

  onLoaded() {
    if (helpfulHasDisappeared()) this.prepareHelpful();
    if (findHelpfulRescueRouteState() === 1) this.prepareHelpfulRescue();
  }

  onZoneEntered(zoneName, object) {
    this.acidZone.onZoneEntered(zoneName, object);
  }

  prepareHelpful() {
    const character = game.uniqueCharacterStorage.getCharacter("helpful-copain");
    if (character) {
      game.uniqueCharacterStorage.loadCharacterToCurrentLevel("helpful-copain", 26, 21);
      character.statistics.hitPoints = Math.min(character.statistics.hitPoints, 12);
      character.setAnimation("fall");
    }
  }

  prepareHelpfulRescue() {
    this.scene = new HelpfulRescueScene(this);
    this.scene.initialize();
    game.quests.getQuest("junkville/findHelpful").setVariable("rescue-route", 2);
    console.log("quest initialized");
  }

  onZoneEntered(zoneName, character) {
    if (character === game.player && zoneName === "world-exit") {
      if (helpfulExitCavernHook()) return true;
    }
    return false;
  }
}

export function create(model) {
  return new Level(model);
}

