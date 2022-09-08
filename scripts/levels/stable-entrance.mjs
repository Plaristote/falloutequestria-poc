import {LevelBase} from "./base.mjs";

class Level extends LevelBase {
  onExit() {
    const accessComputer = level.findObject("access-computer");
    accessComputer.setVariable("enabled", true);
    super.onExit();
  }

  onZoneEntered(zoneName, object) {
    if (zoneName === "about-to-exit" && object === game.player && !level.hasVariable("exited-once")) {
      level.setVariable("exited-once", 1);
      game.player.actionQueue.reset();
      game.appendToConsole(i18n.t("stable-entrance.about-to-exit"));
      game.player.statistics.addExperience(250);
      game.appendToConsole(i18n.t("messages.xp-gain", { xp: 250 }));
    }
  }
}

export function create(model) {
  return new Level(model);
}
