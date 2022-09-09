import {requireQuest} from "../../quests/helpers.mjs";
//import {} from "../../quests/junkville/findHelpful.mjs"

function getQuest() { return requireQuest("junkville/findHelpful"); }

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  getEntryPoint() {
    if (this.dialog.npc.hasVariable("quest-talked"))
      return "entry-alt";
    this.dialog.npc.setVariable("quest-talked", 1);
    return "entry";
  }

  nothingSaid() {
    this.dialog.npc.unsetVariable("quest-talked");
  }

  hasQuestFromRandy() {
    const quest = game.quests.getQuest("junkville/findHelpful");
    return quest && quest.getVariable("initBy") == "cook";
  }

  askMorePayment() {
    const success = game.player.statistics.trade >= 82;
    if (!success)
      game.dataEngine.addReputation("junkville", -12);
    return success ? "payment-asked-more-success" : "payment-asked-more-failure";
  }

  onExplain() {
    const quest = getQuest();
    quest.completeObjective("talk-to-parents");
  }

  acceptedPayment1() {
    getQuest().setVariable("payment", 200)
  }

  acceptedPayment2() {
    getQuest().setVariable("payment", 400);
  }

  hasFoundHelpful() {
    const quest = getQuest();
    return quest.isObjectiveComplete("find-helpful");
  }

  canGetHelpForHelpful() {
    const quest = getQuest();
    return this.hasFoundHelpful() && !quest.hasVariable("died");
  }

  canConvinceToExplain() {
    return game.player.statistics.speech > 45;
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
