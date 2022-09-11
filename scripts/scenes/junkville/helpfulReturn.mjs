import {SceneManager} from "../../behaviour/sceneManager.mjs";
import {requireQuest} from "../../quests/helpers.mjs";

export class HelpfulReturnScene extends SceneManager {
  constructor(parent) {
    super(parent, "helpful-return");
    this.mom = level.findObject("house-copain.copain-mom");
    this.dad = level.findObject("house-copain.copain-dad");
    this.son = game.getCharacter("helpful-copain");
    game.playerParty.removeCharacter(this.son);
  }

  get actors() {
    return [this.mom, this.dad, this.son];
  }

  get states() {
    return [
      this.lineState(this.mom, this.son, this.line("mom#1"), 4321),
      this.sonReachesMother.bind(this),
      this.lineState(this.son, this.mom, this.line("son#1"), 5432),
      this.lineState(this.mom, this.son, this.line("mom#2"), 5432),
      this.lineState(this.son, this.mom, this.line("son#2"), 5432),
      this.lineState(this.mom, this.son, this.line("mom#3"), 7654),
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

  sonReachesMother() {
    const actionQueue = this.son.actionQueue;
    actionQueue.pushReach(this.mom, 2);
    actionQueue.pushScript(this.triggerNextStep.bind(this));
    actionQueue.start();
  }

  finalize() {
    super.finalize();
    requireQuest("junkville/findHelpful").completeObjective("save-helpful");
    this.son.setScript("junkville/helpful-copain.mjs");
  }
}
