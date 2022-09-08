import {getValueFromRange} from "../behaviour/random.mjs";
import {AcidZoneEffect} from "./components/acidZoneEffect.mjs";

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

  onZoneEntered(zoneName, object) {
    this.acidZone.onZoneEntered(zoneName, object);
  }
}

export function create(model) {
  return new Level(model);
}

