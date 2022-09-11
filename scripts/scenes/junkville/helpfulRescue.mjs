import {SceneManager} from "../../behaviour/sceneManager.mjs";
import {requireQuest} from "../../quests/helpers.mjs";

export class HelpfulRescueScene extends SceneManager {
  constructor(parent) {
    super(parent, "helpful-rescue");
    this.mom = game.getCharacter("junkville-copain-mom");
    this.dad = game.getCharacter("junkville-copain-dad");
    this.son = game.getCharacter("helpful-copain");
    this.son.setAnimation("dead");
  }

  get actors() {
    return [this.mom, this.dad, this.son];
  }

  get states() {
    return [
      this.momReachesSon.bind(this),
      this.lineState(this.mom, this.son, this.line("mom#1"), 4321),
      this.lineState(this.son, this.mom, this.line("son#1"), 5432),
      this.lineState(this.mom, this.son, this.line("mom#2"), 5432),
      this.lineState(this.son, this.mom, this.line("son#2"), 5432),
      this.lineState(this.dad, this.son, this.line("dad#1"), 4123),
      this.craftSplint.bind(this),
      this.momReachesPlayer.bind(this),
      this.lineState(this.mom, game.player, this.line("splint-done"), 5711),
      this.finalize.bind(this)
    ];
  }

  lineState(character, target, line, duration) {
    const callback = this.triggerNextStep.bind(this);
    return function() {
      const actionQueue = character.actionQueue;
      if (target)
        character.lookAt(target);
      actionQueue.pushSpeak(line, duration);
      actionQueue.pushWait(duration / 1000);
      actionQueue.pushScript(callback);
      actionQueue.start();
    };
  }

  craftSplint() {
    const actionQueue = this.dad.actionQueue;
    const callback = this.triggerNextStep.bind(this);
    actionQueue.pushReach(this.son);
    actionQueue.pushAnimation("use");
    actionQueue.pushScript(() => {
      this.son.setVariable("slint-crafted", 1);
      game.playerParty.addCharacter(this.son);
      game.asyncAdvanceTime(10, callback);
    });
  }

  momReachesSon() {
    const actionQueue = this.mom.actionQueue;
    actionQueue.pushReach(this.son);
    actionQueue.pushScript(this.triggerNextStep.bind(this));
    actionQueue.start();
    this.dad.lookAt(this.son);
  }

  momReachesPlayer() {
    const actionQueue = this.mom.actionQueue;
    actionQueue.pushWait(2);
    actionQueue.pushReach(game.player, 2);
    actionQueue.pushScript(() => {
      if (this.mom.getDistance(game.player) > 4)
        this.momReachesPlayer();
      else
        this.triggerNextStep();
    });
    actionQueue.start();
  }

  finalize() {
    this.actors.forEach(actor => { actor.tasks.addUniqueTask("followPlayer", 2841, 0); });
    super.finalize();
  }
}

