import {getValueFromRange} from "behaviour/random.mjs";
import {RandomEncounterComponent} from "./randomEncounters.mjs";

export class Game extends RandomEncounterComponent {
}

export function create(model) {
  return new Game(model);
}
