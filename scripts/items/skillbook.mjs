import {Consumable} from "./consumable.mjs";
import {increaseBookCount} from "../cmap/perks/bookworm.mjs";

function afterRead(skill, target, base) {
  const stats  = target.statistics;
  const points = stats[skill];

  stats[skill] = points + base;
  game.appendToConsole(i18n.t("messages.read-skillbook", {
    skillName: i18n.t("cmap." + skill),
    points:    base
  }));
  increaseBookCount(target);
}

class Skillbook extends Consumable {
  constructor(model) {
    super(model);
    this.disableCombatUse = true;
  }

  get skill() {
    return this.model.itemType.replace("skill-book-", "");
  }

  isValidTarget(object) {
    return object === game.player;
  }

  consumedBy(target) {
    const stats  = target.statistics;
    const points = stats[this.skill];
    var base = 14;

    if (points > 100)
      base = 0;
    else if (points > 80)
      base = 3;
    else if (points > 60)
      base = 7;
    base += Math.max(0, Math.floor((stats.intelligence - 2) / (points < 80 ? 1 : 2)));
    if (stats.perks.indexOf("bookworm") >= 0)
      base += 2;
    game.asyncAdvanceTime(180, afterRead.bind(null, this.skill, target, base));
  }
}

export function create(model) {
  return new Skillbook(model);
}
