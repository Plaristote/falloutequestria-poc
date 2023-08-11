class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  about() {
    const answers = [];

    if (this.dialog.stateReference != "about/evil")
      answers.push("tell-slavery-is-wrong");
    if (this.dialog.stateReference != "about/clients")
      answers.push("ask-about-clients");
    if (this.dialog.stateReference != "about/getting-slaves")
      answers.push("ask-about-slave-sources");
    answers.push("back-to-entry");
    return {
      answers: answers
    };
  }

  isSlaversErrandActive() {
    const quest =  game.quests.getQuest("cristal-den/slavers-errand");

    return quest && !quest.isObjectiveCompleted("fetchSlaves");
  }

  onSentToBossOffice() {
    game.setVariable("cristalDenSlavers.canSeeBoss", 1);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
