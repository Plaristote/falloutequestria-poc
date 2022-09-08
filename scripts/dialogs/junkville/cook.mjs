import {DialogHelper} from "../helpers.mjs";
import {skillContest} from "../../cmap/helpers/checks.mjs";
import {requireQuest} from "../../quests/helpers.mjs";
import {
  startUndergroundBattle,
  hasAltLeaderTakenOver
} from "../../quests/junkvilleNegociateWithDogs.mjs";
import {isHelpfulQuestAvailable} from "../../quests/junkville/findHelpful.mjs";

class Dialog extends DialogHelper {
  constructor(dialog) {
    super(dialog);
  }

  getEntryPoint() {
    return "entry";
  }

  introduction() {
    if (!this.dialog.npc.hasVariable("met")) {
      this.dialog.npc.setVariable("met", true);
      return this.dialog.t("introduction");
    }
  }

  intendantToldAboutLeader() {
    return level.hasVariable("intendantToldAboutLeader");
  }

  availableHauntedHeapQuest() {
    return !game.quests.hasQuest("junkvilleDumpsDisappeared");
  }
  
  jobs() {
    if (this.availableHauntedHeapQuest())
      return this.dialog.t("job-haunted-heap");
    if (isHelpfulQuestAvailable())
      return this.dialog.t("job-find-helpful");
    return this.dialog.t("no-jobs");
  }

  acceptHauntedHeapQuest() {
    const object = requireQuest("junkvilleDumpsDisappeared");
    object.setVariable("initBy", this.dialog.npc.objectName);
  }

  acceptFindHelpfulQuest() {
    const object = requireQuest("junkville/findHelpful");
    object.setVariable("initBy", this.dialog.npc.objectName);
  }
  
  get junkvilleDumpsDisappeared() {
    return game.quests.getQuest("junkvilleDumpsDisappeared");
  }

  hasHauntedDumpQuest() {
    const quest = this.junkvilleDumpsDisappeared;
    return quest && !quest.completed && !quest.failed;
  }

  availableHauntedDumpQuest() {
    return !game.quests.hasQuest("junkvilleDumpsDisappeared") ;
  }

  reportDisappearedLocation() {
    const quest = requireQuest("junkvilleNegociateWithDogs");

    if (quest.getScriptObject().isObjectiveCompleted("junkville-warned"))
      quest.completeObjective("junkville-warned");
  }

  hauntedDumpDisappearedFound() {
    return this.junkvilleDumpsDisappeared && this.junkvilleDumpsDisappeared.isObjectiveCompleted("find-disappeared");
  }

  hauntedDumpDisappearedDone() {
    return this.junkvilleDumpsDisappeared && this.junkvilleDumpsDisappeared.isObjectiveCompleted("save-captives");
  }

  hauntedDumpAreCaptiveAllDead() {
    return this.junkvilleDumpsDisappeared.getScriptObject().captiveAllDead();
  }

  hautedDumpAreCaptiveAllAlive() {
    return this.junkvilleDumpsDisappeared.getScriptObject().captiveAlive();
  }
  
  hauntedDumpOnReport() {
    if (this.hauntedDumpAreCaptiveAllAlive()) {
      return this.dialog.t("job-haunted-heap-on-report");
    } else if (this.hauntedDumpAreCaptiveAllDead()) {
      game.dataEngine.addReputation("junkville", -35);
      return {
        text: this.dialog.t("job-haunted-heap-on-report-lie"),
        answers: []
      };
    }
    return this.dialog.t("job-haunted-heap-on-report-partial-success");
  }

  hauntedHeapTakeReward() {
    game.player.inventory.addItemOfType("bottlecaps", 150);
  }
  
  hauntedHeapLeaveReward() {
    game.dataEngine.addReputation("junkville", 75);
  }

  hasDogMediationQuest() {
    if (game.quests.hasQuest("junkvilleNegociateWithDogs"))
      return requireQuest("junkvilleNegociateWithDogs").inProgress;
    return false;
  }

  hasDogTradeRoute() {
    return requireQuest("junkvilleNegociateWithDogs").getVariable("mediation") == "trade";
  }

  hasDogZoneRoute() {
    return requireQuest("junkvilleNegociateWithDogs").getVariable("mediation") == "zone";
  }

  dogsHoldingHostages() {
    const quest = requireQuest("junkvilleDumpsDisappeared");
    return !quest.getScriptObject().isObjectiveCompleted("save-captives");
  }

  dogsKilledHostages() {
    const quest = requireQuest("junkvilleDumpsDisappeared");
    return quest.getScriptObject().captiveKilledByDogs();
  }

  onDogMediationEntry() {
    const quest = requireQuest("junkvilleNegociateWithDogs");

    if (quest.getScriptObject().isObjectiveCompleted("junkville-warned"))
      return this.dialog.t("dogs-mediation-reentry");
    quest.completeObjective("junkville-warned");
    return this.dialog.t("dogs-mediation-entry");
  }

  onMediationProposal() {
    if (!this.hauntedDumpDisappearedFound()) {
      requireQuest("junkvilleDumpsDisappeared");
      return "dogs-negociation-disappeared";
    }
    else if (hasAltLeaderTakenOver())
      return "dogs-negociation-failed";
    else if (this.dogsKilledHostages())
      return "dogs-negociation-killed";
    else if (this.dogsHoldingHostages())
      return "dogs-negociation-hostages";
    return "dogs-negociation-accept";
  }

  onDogsMediationMustRelease() {
    requireQuest("junkvilleNegociateWithDogs").setVariable("mustReleaseDogs", true);
  }

  mediationAccepted() {
    requireQuest("junkvilleNegociateWithDogs").setVariable("mediation-accepted", true);
    return this.hasDogTradeRoute() ?
      this.dialog.t("dogs-negociation-accept-trade") : this.dialog.t("dogs-negociation-accept");
  }

  dogsBattleCanAppease() {
    return game.player.statistics.speech > 90;
  }

  dogsBattlePeacemakingLine() {
    if (this.dogsBattleCanAppease())
      return this.dialog.t("dogs-battle-peacemaking-convince-success");
    return this.dialog.t("dogs-battle-peacemaking-convince");
  }

  onDogsBattlePeacemaingAppease() {
    if (this.dogsBattleCanAppease())
      return "dogs-battle-peacemaking-appeased";
    return "dogs-battle-peacemaking-not-appeased";
  }

  onAskReward() {
    if (this.improvedBattleReward === undefined) {
      requireQuest("junkvilleNegociateWithDogs").setVariable("battleReward", 100);
    } else if (this.improvedBattleReward) {
      requireQuest("junkvilleNegociateWithDogs").setVariable("battleReward", 200);
      return this.dialog.t("dogs-battle-ask-reward-improved");
    } else {
      return this.dialog.t("dogs-battle-ask-reward-fail");
    }
  }

  canAskBetterReward() {
    return this.improvedBattleReward === undefined;
  }

  askBetterReward() {
    const winner = skillContest(game.player, this.dialog.npc, "barter")

    this.improvedBattleReward = winner === game.player;
  }

  canGetBattleReward() {
    const quest = game.quests.getQuest("junkvilleNegociateWithDogs");
    if (quest && quest.getScriptObject().isObjectiveCompleted("win-battle"))
      return quest.getVariable("battleReward") > 0;
    return false;
  }

  giveBattleReward() {
    game.player.inventory.addItemOfType("bottlecaps",
      requireQuest("junkvilleNegociateWithDogs").getVariable("battleReward")
    );
  }

  startBattle() {
    startUndergroundBattle();
  }

  startBattleWithoutPlayer() {
    this.dialog.npc.tasks.addTask("headTowardsBattle", 1500, 0);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
