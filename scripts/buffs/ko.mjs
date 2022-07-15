import {StackableBuff} from "./helpers/stackable.mjs";

class Ko extends StackableBuff {
  initialize() {
    const message = this.model.target === game.player ? "player-ko" : "ko";
    this.charges = 1;
    this.model.target.fallUnconscious();
    game.appendToConsole(i18n.t(`messages.${message}`, {
      target: this.model.target.displayName
    }));
    this.model.tasks.addTask("trigger", 10000, 0);
  }

  trigger() {
    this.charges--;
    if (this.charges <= 0)
      this.model.remove();
  }
  
  finalize() {
    this.model.target.wakeUp();
  }
}

export function create(model) {
  return new Ko(model);
}
