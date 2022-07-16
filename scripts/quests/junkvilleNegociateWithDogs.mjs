import {QuestHelper, requireQuest} from "./helpers.mjs";
import {
  isLookingForDisappearedPonies,
  hasFoundDisappearedPonies,
  onDisappearedPoniesFound,
  captiveReleaseAuthorized
} from "./junkvilleDumpsDisappeared.mjs";
import {getValueFromRange} from "../behaviour/random.mjs";

const questName = "junkvilleNegociateWithDogs";

function hasQuest() { return game.quests.hasQuest(questName); }
function getQuest() { return game.quests.getQuest(questName); }

export function safeObjectiveCompleted() {
  if (hasQuest())
    getQuest().completeObjective("safe");
}

export function mediationNeedsCaptiveRelease() {
  let result = false;
  if (!hasFoundDisappearedPonies())
    console.log(questName, "-> mediationNeedsCaptiveRelease: player is not yet aware about captives.");
  else if (hasQuest() && getQuest().getVariable("mustReleaseDogs") === true)
    result = !captiveReleaseAuthorized();
  console.log(questName, "-> mediationNeedsCaptiveRelease?", result);
  return result;
}

export function startMediation(type) {
  const quest = requireQuest("junkvilleNegociateWithDogs");
  quest.setVariable("mediation", type);
  console.log(questName, "-> startMediation", type);
}

export function hasMediationStarted() {
  console.log("toto2#1");
  return hasQuest() && getQuest().hasVariable("mediation");
}

export function hasBattleStarted() {
  return hasQuest() && getQuest().hasVariable("battleState");
}

function junkvilleCombattantTemplate() {
  const capsCount = getValueFromRange(0, 31);
  const ammoCount = getValueFromRange(12, 28);
  let items = [];
  let slots = {};

  items.push({ itemType: "9mm-ammo", quantity: ammoCount });
  if (capsCount > 0)
    items.push({ itemType: "bottlecaps", quantity: capsCount });
  slots["use-1"] = { hasItem: true, itemType: "mouthgun", ammo: 6, maxAmmo: 6 };
  return {
    sheet: "junkville-combattant",
    script: "junkville/underground-combattant.mjs",
    inventory: {
      items: items,
      slots: slots
    }
  };
}

export function startUndergroundBattle() {
  requireQuest(questName).setVariable("battleState", 1);
  game.setVariable("junkvilleUndergroundBattle", true);
  level.tasks.addTask("goToUndergroundBattle", 1500, 1);
}

export function initializeBattle() {
  let junkvilleNpcs;
  game.diplomacy.setAsEnemy(true, "junkville", "diamond-dogs");
  game.diplomacy.setAsEnemy(true, "player", "diamond-dogs");
  junkvilleNpcs = game.createNpcGroup({
    name: "junkville",
    members: [
      {
        sheet: "junkville-cook",
        script: "junkville/cook-underground-combat.mjs",
        items: []
      },
      junkvilleCombattantTemplate(1),
      junkvilleCombattantTemplate(2),
      junkvilleCombattantTemplate(3),
      junkvilleCombattantTemplate(4)
    ]
  });
  junkvilleNpcs.insertIntoZone(level, "battle-entry");
  if (level.getScriptObject().liveCaptives.length > 0)
    onDisappearedPoniesFound();
  level.getScriptObject().liveCaptives.forEach(captive => {
    captive.tasks.addUniqueTask("reachExitZone", 1500, 0);
  });
}

function killArray(array) {
  array.forEach(character => {
    character.takeDamage(character.statistics.hitPoints, null);
  });
}

export function finalizeBattle(options) {
  const quest = requireQuest(questName);
  const { survivors, escaping } = options;

  quest.setVariable("battleState", 2);
  if (escaping) {
    quest.setVariable("escaped", true);
    game.dataEngine.addReputation("junkville", -60);
  } else {
    game.dataEngine.addReputation("junkville", 60);
  }
  if (survivors.dogs.length > survivors.junkville.length) {
    console.log("-> dogs won");
    game.setVariable("junkvilleBattleCookDied", 1);
    quest.completeObjective("lose-battle");
    killArray(survivors.captives);
    killArray(survivors.junkville);
  } else {
    console.log("-> junkville won");
    killArray(survivors.dogs);
    quest.completeObjective("win-battle");
    game.dataEngine.addReputation("junkville", 35);
  }
}

export function clearBattle(options) {
  const quest = requireQuest(questName);

  if (quest.getVariable("battleState") !== 2) {
    finalizeBattle({
      escaping: true,
      survivors: options.survivors
    });
  }
  if (quest.getScriptObject().isObjectiveCompleted("win-battle")) {
    survivors.captives.forEach(character => {
      character.getScriptObject().onSaved();
    });
    survivors.junkville.forEach(character => {
      level.deleteObject(character);
    });
  }
}

export function internalPackIssueDone() {
  if (hasQuest()) {
    const script = getQuest().getScriptObject();
    return script.isObjectiveCompleted("alt-leader-convinced")
        || script.isObjectiveCompleted("alt-leader-dead")
        || script.isObjectiveCompleted("alt-leader-took-over");
  }
  return false;
}

export function shouldAltLeaderTakeOver() {
  return hasQuest() && !internalPackIssueDone() && captiveReleaseAuthorized();
}

export function hasAltLeaderTakenOver() {
  return hasQuest() &&
         getQuest().getScriptObject().isObjectiveCompleted("alt-leader-took-over");
}

export function makeAltLeaderTakeOver() {
  requireQuest(questName).completeObjective("alt-leader-took-over");
  game.diplomacy.setAsEnemy(true, "diamond-dogs", "player");
  game.diplomacy.setAsEnemy(true, "diamond-dogs", "junkville");
}

export class JunkvilleNegociateWithDogs extends QuestHelper {
  initialize() {
    this.model.location = "junkville";
  }
  
  get xpReward() {
    if (this.isObjectiveCompleted("win-battle"))
      return 1450;
    return 750;
  }
  
  getObjectives() {
    const objectives = [];

    objectives.push({
      label: this.tr("save-yourself-from-the-diamond-dogs"),
      success: this.isObjectiveCompleted("safe")
    });
    objectives.push({
      label: this.tr("warn-junkville-about-diamond-dogs"),
      success: this.isObjectiveCompleted("junkville-warned"),
      failure: !this.isObjectiveCompleted("junkville-warned") && hasBattleStarted()
    });
    if (internalPackIssueDone()) {
      objectives.push({
        label: this.tr("solve-pack-unrest"),
        success: this.isObjectiveCompleted("alt-leader-convinced") || this.isObjectiveCompleted("alt-leader-dead"),
        failure: this.isObjectiveCompleted("alt-leader-took-over")
      });
    }
    if (hasMediationStarted()) {
      objectives.push({
        label: this.model.getVariable("mediation") == "trade" ? this.tr("peaceful-resolve-trade") : this.tr("peaceful-resolve-zone"),
        success: this.isObjectiveCompleted("peaceful-resolve"),
        failure: !this.isObjectiveCompleted("peaceful-resolve") && hasBattleStarted()
      });
    }
    if (hasBattleStarted()) {
      objectives.push({
        label: this.tr("win-battle"),
        success: this.isObjectiveCompleted("win-battle"),
        failure: this.isObjectiveCompleted("lose-battle")
      });
    }
    return objectives;
  }

  completeObjective(objective) {
    super.completeObjective(objective);
    switch (objective) {
      case "peaceful-resolve":
      case "win-battle":
        this.model.completed = true;
        break ;
      case "lose-battle":
        this.model.completed = this.model.failed = true;
        break ;
    }
  }

  onSuccess() {
    if (this.isObjectiveCompleted("win-battle"))
      game.appendToConsole(i18n.t("junkville-dog-mediation.win-battle"));
    super.onSuccess();
  }
}
