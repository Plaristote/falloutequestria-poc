import {getValueFromRange} from "../behaviour/random.mjs";
import {AcidZoneEffect} from "./components/acidZoneEffect.mjs";
import {helpfulHasDisappeared} from "../quests/junkville/findHelpful.mjs";

export class Level {
  constructor(model) {
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
  }

  onZoneEntered(zoneName, object) {
    this.acidZone.onZoneEntered(zoneName, object);
  }

  prepareHelpful() {
    const character = game.uniqueCharacterStorage.getCharacter("helpful-copain");
    if (character) {
      game.uniqueCharacterStorage.loadCharacterToCurrentLevel("helpful-copain", 26, 21);
      character.statistics.hitPoints = Math.min(character.statistics.hitPoints, 12);
    }
  }
}

export function create(model) {
  return new Level(model);
}

