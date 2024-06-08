import {QuestHelper, requireQuest} from "./helpers.mjs";

const captiveCount = 3;
const questName = "junkvilleDumpsDisappeared";

function hasQuest() { return game.quests.hasQuest(questName); }
function getQuest() { return game.quests.getQuest(questName); }

export function isLookingForDisappearedPonies() {
  let result = false;
  if (hasQuest())
    result = !getQuest().getScriptObject().captiveFound();
  console.log(questName, "-> isLookingForDisappearedPonies?", result);
  return result;
}

export function hasFoundDisappearedPonies() {
  let result = false;
  result = hasQuest() && getQuest().getScriptObject().captiveFound();
  console.log(questName, "-> hasFoundDisappearedPonies?", result);
  return result;
}

export function onDisappearedPoniesFound() {
  requireQuest(questName).completeObjective("find-disappeared");
  console.log(questName, "-> onDisappearedPoniesFound");
}

export function authorizeCaptiveRelease() {
  const quest = requireQuest("junkvilleDumpsDisappeared");
  quest.setVariable("authorizeCaptiveRelease", true);
}

export function captiveReleaseAuthorized() {
  const quest = getQuest();
  const result = quest && quest.getVariable("authorizeCaptiveRelease") === true;
  console.log(questName, "-> captiveReleaseAuthorized", result);
  return result;
}

export function areCaptorsDead() {
  return game.hasVariable("junkvilleDogsWipedOut");
}

export class JunkvilleDumpsDisappeared extends QuestHelper {
  initialize() {
    this.model.location = "junkville";
  }
  
  get xpReward() {
    return this.captiveAlive() ? 1000 : 750;
  }

  get savedCount() {
    return this.model.hasVariable("save-count") ? this.model.getVariable("save-count") : 0;
  }

  set savedCount(value) {
    this.model.setVariable("save-count", value);
  }

  get killedCaptiveCount() {
    return this.model.hasVariable("killed-captives") ? this.model.getVariable("killed-captives") : 0;
  }

  set killedCaptiveCount(value) {
    this.model.setVariable("killed-captives", value);
  }

  getObjectives() {
    const objectives = [];

    objectives.push({
      label: this.tr("find-disappeared"),
      success: this.captiveFound()
    });
    if (this.model.isObjectiveCompleted("find-disappeared")) {
      objectives.push({
        label: this.tr("save-all-captives"),
        success: this.captiveAlive() && this.model.isObjectiveCompleted("save-captives"),
        failed: !this.captiveAlive()
      });
      if (!this.captiveAlive()) {
        objectives.push({
          label: this.tr("save-some-captives"),
          success: this.model.isObjectiveCompleted("save-captives"),
          failed: this.captiveAllDead()
        });
      }
      objectives.push({
        label: this.tr("report-success"),
        success: this.model.isObjectiveCompleted("report-success")
      });
    }
    return objectives;
  }

  onCaptiveKilled() {
    this.killedCaptiveCount++;
    if (this.captiveAllDead())
      this.model.completed = this.model.failed = true;
  }

  setDiamondDogsAsHostiles(value) {
    this.model.setVariable("dogs-hostile", value);
  }

  captiveFound() {
    return this.model.isObjectiveCompleted("find-disappeared");
  }

  captiveSaved() {
    this.savedCount++;
    if (this.savedCount == captiveCount)
      this.model.completeObjective("save-all-captives");
    if (this.savedCount + this.killedCaptiveCount == captiveCount)
      this.model.completeObjective("save-captives");
  }

  captiveAlive() {
    return !this.model.hasVariable("killed-captives");
  }

  captiveAllDead() {
    return !this.captiveAlive() && this.killedCaptiveCount >= captiveCount;
  }

  captiveKilledByDogs() {
    return this.model.getVariable("dogs-hostile") === true;
  }

  completeObjective(name, success) {
    if (name === "save-captives") {
      this.model.completed = true;
      this.model.failed = !success;
    }
  }

  onCompleted() {
    super.onCompleted();
    game.dataEngine.addReputation("junkville", this.model.failed ? -75 : -100);
  }
}
