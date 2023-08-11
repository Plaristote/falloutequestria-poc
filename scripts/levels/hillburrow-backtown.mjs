import {Hillburrow} from "./hillburrow.mjs";
import * as SlaveRiot from "../quests/hillburrow/slaveRiot.mjs";

export class HillburrowBacktown extends Hillburrow {
  onExit() {
    SlaveRiot.onExitBacktown();
  }

  removeSlaves() {
    level.find("slaves.*").forEach(slave => { level.deleteObject(slave); });
  }
}
