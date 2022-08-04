import {Generator} from "../generator.mjs";

export class StabletechGenerator extends Generator {
  onRunningChanged() {
    const commandTerminal = level.findObject("control-room.terminal");
    const sentinels = level.findGroup("security-room").objects;

    super.onRunningChanged();
    commandTerminal.getScriptObject().enabled = this.running;
    level.getScriptObject().guards.forEach(sentinel => {
      if (this.running) {
        sentinel.wakeUp();
        sentinel.setAnimation("get-up");
      }
      else {
        sentinel.fallUnconscious();
        sentinel.setAnimation("fall-down");
      }
    });
  }
}
