import {LevelBase} from "./base.mjs";
import {waterCarrierAppearences, waterCarrierPopPositions} from "../pnjs/hillburrow/water-carrier.mjs";

export class Hillburrow extends LevelBase {
  initialize() {
    level.tasks.addUniqueTask("refreshWaterCarrier", 60000, 0);
  }

  onLoaded() {
    const waterCarrierTask = this.currentWaterCarrierTask();

    console.log("Loading Hillburrow map. Current water carrier task: ", waterCarrierTask);
    switch (waterCarrierTask) {
      case "none":
        this.depopWaterCarrier();
        break ;
      default:
        this.popWaterCarrier(waterCarrierTask);
        break ;
    }
  }

  get waterCarrier() {
    return level.findObject("water-carrier");
  }

  currentWaterCarrierTask() {
    const schedule = waterCarrierAppearences[level.name];
    const hour     = game.timeManager.hour;
    const minute   = game.timeManager.second;

    for (var appearence of schedule) {
      if (game.timeManager.isWithinRange(appearence))
        return appearence.task;
    }
    return "none";
  }

  refreshWaterCarrier() {
    if (!this.waterCarrier) {
      const schedule = waterCarrierAppearences[level.name];
      const hour     = game.timeManager.hour;
      const minute   = game.timeManager.second;

      for (var appearence of schedule) {
        if (game.timeManager.isWithinRange(appearence)) {
          if (!this.waterCarrier)
            this.popWaterCarrier(appearence.task);
          return ;
        }
      }
    }
  }

  popWaterCarrier(task) {
    const character = game.uniqueCharacterStorage.getCharacter("hillburrow/water-carrier");

    console.log("Popping water carrier in this hillburrow map", level.name);
    if (character && character.isAlive()) {
      const popPosition = waterCarrierPopPositions[task];
      game.uniqueCharacterStorage.loadCharacterToCurrentLevel("hillburrow/water-carrier", popPosition.x, popPosition.y, popPosition.z);
      character.getScriptObject().currentTask = task;
    }
  }

  depopWaterCarrier() {
    const character = this.waterCarrier;

    if (character) {
      if (character.isAlive())
        game.uniqueCharacterStorage.saveCharacterFromCurrentLevel(character);
      else
        leve.tasks.removeTask("refreshWaterCarrier");
    }
  }
}
