import {Hillburrow} from "./hillburrow.mjs";
import {WaterCarrierInterrogationScene} from "../scenes/hillburrow/waterCarrierInterrogation.mjs";
import * as SlaveRiot from "../quests/hillburrow/slaveRiot.mjs";

export class HillburrowBacktown extends Hillburrow {
  onLoaded() {
    super.onLoaded();
    this.waterCarrierInterrogationScene = new WaterCarrierInterrogationScene(this);
  }

  onExit() {
    SlaveRiot.onExitBacktown();
  }

  removeSlaves() {
    level.find("slaves.*").forEach(slave => { level.deleteObject(slave); });
  }
}
