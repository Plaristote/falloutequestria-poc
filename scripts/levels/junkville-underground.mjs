import {LevelBase} from "./base.mjs";
import {
  initializeBattle,
  finalizeBattle,
  clearBattle,
  safeObjectiveCompleted,
  shouldAltLeaderTakeOver,
  makeAltLeaderTakeOver
} from "../quests/junkvilleNegociateWithDogs.mjs";

export class JunkvilleUnderground extends LevelBase {
  onLoaded() {
    if (game.getVariable("junkville-dog-hole") === true) {
      level.tasks.addTask("onFellIntoHole", 100, 1);
      game.unsetVariable("junkville-dog-hole");
    }
    if (game.getVariable("junkvilleUndergroundBattle") === true) {
      initializeBattle();
      game.unsetVariable("junkvilleUndergroundBattle");
      game.setVariable("ongoingJunkvilleUndergroundBattle", true);
    }
  }

  onFellIntoHole() {
    const guard = level.findObject("pack.guard");

    guard.getScriptObject().investigatePlayerFall();
  }

  onExit() {
    if (level.getVariable("captive-released") === true)
      this.clearLiveCaptives();
    if (game.getVariable("ongoingJunkvilleUndergroundBattle"))
      this.clearBattle();
    if (shouldAltLeaderTakeOver())
      this.altLeaderTakesOver();
    safeObjectiveCompleted();
  }

  get diamondDogs() {
    const group = level.findGroup("pack");
    const result = [level.findObject("dog-leader"), level.findObject("dog-alt-leader")];

    for (let i = 0 ; i < group.objects.length ; ++i)
      result.push(group.objects[i]);
    return result;
  }

  get captives() {
    return level.findGroup("captives");
  }

  get liveDiamondDogs() {
    const result = [];

    this.diamondDogs.forEach(dog => {
      if (dog.isAlive())
        result.push(dog);
    });
    return result;
  }

  get liveCaptives() {
    const captives = this.captives;
    const result = [];

    for (var i = 0 ; i < captives.objects.length ; ++i) {
      if (captives.objects[i].isAlive())
        result.push(captives.objects[i]);
    }
    return result;
  }

  get junkvilleCombattants() {
    const result = [];

    for (let i = 0 ; i < level.objects.length ; ++i) {
      const object = level.objects[i];
      if (object.getObjectType() === "Character" && object.statistics.faction === "junkville")
        result.push(object);
    }
    return result;
  }

  get liveJunkvilleCombattants() {
    const result = [];

    this.junkvilleCombattants.forEach(character => {
      if (character.isAlive())
        result.push(character);
    });
    return result;
  }

  sendCaptivesToExit() {
    level.setVariable("captive-released", true);
    this.liveCaptives.forEach(captive => {
      captive.tasks.addUniqueTask("reachExitZone", 1500, 0);
    });
  }

  clearLiveCaptives() {
    this.liveCaptives.forEach(captive => {
      captive.getScriptObject().onSaved();
    });
  }

  onDogDied() {
    console.log("onDogDied", this.liveDiamondDogs.length);
    if (this.liveDiamondDogs.length == 0)
      this.onBattleEnded();
  }

  onBattleEnded() {
    console.log("onBattleEnded");
    finalizeBattle({
      survivors: {
        dogs: this.liveDiamondDogs,
        junkville: this.liveJunkvilleCombattants,
        captives: this.liveCaptives
      }
    });
  }

  clearBattle() {
    console.log("clearBattle");
    game.unsetVariable("ongoingJunkvilleUndergroundBattle");
    clearBattle({
      survivors: {
        dogs: this.liveDiamondDogs,
        junkville: this.liveJunkvilleCombattants,
        captives: this.liveCaptives
      }
    });
  }

  altLeaderTakesOver() {
    console.log("altLeaderTakesOver");
    const altLeader = level.findObject("dog-alt-leader");
    const leader = level.findObject("dog-leader");

    leader.takeDamage(9999, null);
    makeAltLeaderTakeOver();
    this.liveCaptives.forEach(captive => {
      captive.takeDamage(9999, null);
    });
  }
}
