import {requireQuest} from "../../quests/helpers.mjs";
import {
  isLookingForDisappearedPonies,
  onDisappearedPoniesFound,
  authorizeCaptiveRelease
} from "../../quests/junkvilleDumpsDisappeared.mjs";
import {
  startMediation,
  hasMediationStarted,
  mediationNeedsCaptiveRelease
} from "../../quests/junkvilleNegociateWithDogs.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
    this.dialog.ambiance = "cavern";
    game.dataEngine.showReputation("diamond-dogs", true);
  }

  getEntryPoint() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met", true);
      return "introduction";
    }
    return "entry";
  }

  _isLookingForDisappearedPonies() { return isLookingForDisappearedPonies(); }
  _onDisappearedPoniesFound() { onDisappearedPoniesFound(); }

  canProposeTrade() {
    return game.player.statistics.barter > 60;
  }

  canTalkAboutStable() {
    return game.player.statistics.speech > 83;
  }

  canConvinceCaptiveRelease1() {
    return game.player.statistics.speech > 71;
  }

  canConvinceCaptiveRelease2() {
    return game.player.statistics.speech > 82;
  }

  sendPlayerToPen() {
    game.dataEngine.addReputation("diamond-dogs", -30);
    game.playerParty.insertIntoZone(level, "pony-pen");
    level.setVariable("player-in-pen", true);
  }

  startCombat() {
    game.dataEngine.addReputation("diamond-dogs", -200);
    this.dialog.npc.setAsEnemy(game.player);
  }

  _startMediation() { startMediation(this.dialog.stateReference.split("-")[3]); }
  _hasMediationStarted() { return hasMediationStarted(); }
  _hasMediationNotStarted() {
    console.log("toto2");
    return !hasMediationStarted(); }

  _authorizeCaptiveRelease() {
    authorizeCaptiveRelease();
    const altLeader = level.findObject("dog-alt-leader");
    altLeader.setVariable("spokeAgainstLeader", 1);
    level.addTextBubble(altLeader, "Our leader listens to ponies... he's not fit to lead the dogs.", 5000, "red");
  }

  _mediationNeedsCaptiveRelease() { return mediationNeedsCaptiveRelease(); }

  isMediationDone() {
    return requireQuest("junkvilleNegociateWithDogs").getVariable("mediation-accepted") === true;
  }

  completeMediationText() {
    if (requireQuest("junkvilleNegociateWithDogs").getVariable("mediation") == "trade") {
      return this.dialog.t("complete-mediation-trade");
    }
    return this.dialog.t("complete-mediation");
  }

  mediationConclusion() {
    const script = requireQuest("junkvilleNegociateWithDogs").getScriptObject();
    let text = script.model.getVariable("mediation") == "trade"
      ? this.dialog.t("mediation-conclusion-trade")
      : this.dialog.t("mediation-conclusion");
    if (script.isObjectiveCompleted("alt-leader-dead"))
      text += "<br>" + this.dialog.t("mediation-conclusion-alt-leader-death");
    script.model.completeObjective("peaceful-resolve");
    this.dialog.mood = "smile";
    return text;
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
