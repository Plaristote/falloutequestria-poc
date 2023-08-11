import {LevelBase} from "./base.mjs";

function prepareRainyPurpleVendetta() {
  const quest = game.quests.getQuest("cristal-den/rainy-purple-vendetta");

  if (quest && quest.inProgress) {
    quest.script.start();
  }
}

export class CristalDenCenter extends LevelBase {
  onLoaded() {
    prepareRainyPurpleVendetta();
  }
}
