import {Consumable} from "./consumable.mjs";
import {increaseBookCount} from "../cmap/perks/bookworm.mjs";

function afterRead(spell, target) {
  const stats = target.statistics;

  if (stats.spells.indexOf(spell) < 0) {
    stats.spells.push(spell);
    game.appendToConsole(i18n.t("messages.read-spellbook", {
      spell: i18n.t("spells." + spell)
    }));
    increaseBookCount(target);
  }
}

class Spellbook extends Consumable {
  constructor(model) {
    super(model);
    this.disableCombatUse = true;
  }

  get spell() {
    return this.model.itemType.replace("spell-book-", "");
  }

  isValidTarget(object) {
    return object === game.player && game.player.statistics.race === "unicorn";
  }

  consumedBy(target) {
    const stats  = target.statistics;
    const points = stats[this.skill];

    if (stats.spells.indexOf(this.spell) < 0)
      game.asyncAdvanceTime(180, afterRead.bind(null, this.spell, target));
    else
      game.appendToConsole(i18n.t("messages.spell-already-known",));
  }
}

export function create(model) {
  return new Spellbook(model);
}

