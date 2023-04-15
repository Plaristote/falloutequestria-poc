import {initializeOldSheriffMurderQuest, hasOldSheriffMurderQuest} from "../../quests/hillburrow/oldSheriffMurder.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  get sheriffQuestReward() {
    return 150;
  }

  canNegociateSheriffQuestReward() {
    return this.dialog.player.statistics.barter > 75;
  }

  startOldSheriffQuest() {
    initializeOldSheriffMurderQuest();
  }

  loseTownReputation() {
    game.dataEngine.addReputation("hillburrow", -3);
  }

  onAskedForWork() {
    if (hasOldSheriffMurderQuest())
      return "no-more-work";
    return "quest-old-sheriff";
  }

  onNameGiven() {
    this.dialog.mood = "smile";
    if (!this.dialog.npc.hasVariable("knowsPlayerName")) {
      this.dialog.npc.setVariable("knowsPlayerName", 1);
      game.dataEngine.addReputation("hillburrow", 3);
      return "entry";
    }
    return "name-already-known";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
