import {DialogComponent} from "./dialog.mjs";
import {getValueFromRange} from "../../behaviour/random.mjs";
import {stealCheck} from "../../cmap/helpers/checks.mjs";

const medecineInterval    = 21600000;
const medecineMaxUseCount = 2;

export class SkillTargetComponent extends DialogComponent {
  constructor(model) {
    super(model);
  }

  onUseMedicine(user) {
    const useCount = this.model.hasVariable("medecineUses") ? this.model.getVariable("medecineUses") : 0;

    if (!this.model.isAlive())
      game.appendToConsole(i18n.t("messages.invalid-target"));
    else if (level.isInCombat(user))
      game.appendToConsole(i18n.t("medicine-skill.in-combat"));
    else if (useCount + 1 > medecineMaxUseCount)
      game.appendToConsole(i18n.t("medecine-skill.max-use-reached"));
    else {
      const stats   = this.model.statistics;
      const maxHeal = stats.maxHitPoints - stats.hitPoints;
      var   healed  = getValueFromRange(0, 10) + user.statistics.medicine / 10;

      healed = healed * user.statistics.medicine / 100;
      healed = Math.min(healed, maxHeal);
      healed = Math.ceil(healed);
      stats.hitPoints += healed;
      game.appendToConsole(i18n.t("medicine-skill.used-on", {
        user:   user.statistics.name,
        target: stats.name,
        hp:     healed
      }));
      this.model.setVariable("medecineUses", useCount + 1);
      this.model.tasks.addTask("medecineSkillWearOff", medecineInterval);
      return true;
    }
    return false;
  }

  medecineSkillWearOff() {
    const useCount = this.model.getVariable("medecineUses");
    if (useCount > 1) { this.model.setVariable("medecineUses", useCount - 1); }
    else              { this.model.unsetVariable("medecineUses"); }
  }

  onTakeItem(user, item, quantity) {
    console.log("on take item", user, item, quantity);
    if (this.model.isAlive() && !this.model.unconscious) {
      return stealCheck(user, this.model, item, quantity, {
        failure:         this.onStealFailure.bind(this, user, false, item),
        criticalFailure: this.onStealFailure.bind(this, user, true, item)
      });
    }
    return true;
  }

  onPutItem(user, item, quantity) {
    return this.onTakeItem(user, item, quantity);
  }

  onStealFailure(character, critical, item) {
    console.log("onStealFailure", critical);
  }
}
