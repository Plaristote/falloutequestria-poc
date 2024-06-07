import {Hillburrow} from "./hillburrow.mjs";
import {WaterCarrierSheriffAmbushScene} from "../scenes/hillburrow/waterCarrierSheriffAmbush.mjs";
import {isVengeanceOngoing, failVengeance} from "../quests/hillburrow/oldSheriffMurder.mjs";

export class HillburrowSource extends Hillburrow {
  onLoaded() {
    super.onLoaded();
    this.waterCarrierSheriffAmbushScene = new WaterCarrierSheriffAmbushScene(this);
  }

  onExit() {
    if (isVengeanceOngoing())
      failVengeance();
  }
}
