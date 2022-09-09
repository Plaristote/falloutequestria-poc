import {LevelBase} from "./base.mjs";

export class JunkvilleDumps extends LevelBase {
  onLoaded() {
    this.prepareRathianForFactoryQuest();
  }

  prepareRathianForFactoryQuest() {
    const quest = game.quests.getQuest("junkvilleStabletechFacility");
    if (quest) quest.getScriptObject().loadJunkvilleDumps();
  }
}
