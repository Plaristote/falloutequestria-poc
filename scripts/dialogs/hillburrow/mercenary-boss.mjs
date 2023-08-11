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
    const sheriffQuest  = requireQuest("hillburrow/oldSheriffMurder");
    sheriffQuest.setVariable("leadsSabotage", 1);
  }

  canAskAboutSabotages() {
    const quest = game.quests.getQuest("hillburrow/sabotage");
    return quest && !quest.hidden && this.dialog.npc.hasVariable("knowsName");
  }

  onAskedAboutSabotages() {
    game.quests.getQuest("hillburrow/sabotage").script.onTalkedWithMercenaryBoss();
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
