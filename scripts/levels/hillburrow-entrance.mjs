import {Hillburrow} from "./hillburrow.mjs";

export class HillburrowEntrance extends Hillburrow {
  onExit() {
    const sheriff = level.find(object => object.characterSheet == "hillburrow/sheriff");

    if (sheriff && sheriff.tasks.hasTask("offscreenVengeance"))
      sheriff.script.finalizeOffscreenVengeance();
  }
}
