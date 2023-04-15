import {requireQuest} from "../../quests/helpers.mjs"

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  onToldName() {
    this.dialog.npc.setVariable("knowsName", 1);
  }

  canAskAboutSheriffMurder() {
    const quest = game.quests.getQuest("hillburrow/oldSheriffMurder");
    return quest && quest.hasVariable("leadsMercenaries") && this.dialog.npc.hasVariable("knowsName");
  }

  knowsAboutSheriffWorkingCase() {
    const quest = game.quests.getQuest("hillburrow/oldSheriffMurder");
    return quest && quest.hasVariable("leadsSheriffWorkingCase") && this.dialog.npc.hasVariable("knowsName");
  }

  onToldAboutSabotage() {
    const sabotageQuest = requireQuest("hillburrow/coalMineSabotage");
    const sheriffQuest  = requireQuest("hillburrow/oldSheriffMurder");
    sabotageQuest.setVariable("canTalkToPotiokAboutSabotage", 1);
    sheriffQuest.setVariable("leadsSabotage", 1);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
