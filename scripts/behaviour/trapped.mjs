import {getValueFromRange} from "./random.mjs";
import {skillCheck} from "../cmap/helpers/checks.mjs";

export class TrappedComponent {
  constructor(parent, options = {}) {
    this.trapLevel = options.trapLevel !== undefined ? options.trapLevel : 1;
    this.model = parent.model;
    this.onTriggered = options.onTriggered;
    this.onSuccess = options.onSuccess;
    this.onFailure = options.onFailure;
    this.onCriticalFailure = options.onCriticalFailure || options.onFailure;
    if (!this.model.hasVariable("trap-xp"))
      this.xpReward = options.xp || (25 + this.trapLevel * 50);
  }

  get xpReward() {
    return this.model.getVariable("trap-xp");
  }

  set xpReward(value) {
    this.model.setVariable("trap-xp", value);
  }

  get disarmed() {
    return this.model.hasVariable("disarmed");
  }

  set disarmed(value) {
    if (value)
      this.model.setVariable("disarmed", value);
    else
      this.model.unsetVariable("disarmed");
  }

  toggleArmed() {
    this.disarmed = !this.disarmed;
  }

  isDisarmed() {
    return this.disarmed == true;
  }

  trigger() {
    this.disarmed = true;
    this.onTriggered();
  }

  onUseExplosives(user) {
    return skillCheck(user, "explosives", {
      target: 65 + this.trapLevel * 15,
      success: this.onTrapSuccess.bind(this, user),
      failure: this.onTrapFailure.bind(this, user),
      criticalFailure: this.onTrapCriticalFailure.bind(this, user)
    });
  }

  onTrapSuccess(user) {
    if (user === level.player) {
      game.appendToConsole(this.successMessage);
      if (this.xpReward > 0)
        game.appendToConsole(i18n.t("messages.xp-gain", {xp: this.xpReward}));
      this.xpReward = 0;
    }
    this.toggleArmed();
    if (this.onSuccess)
      this.onSuccess(user);
  }

  onTrapCriticalFailure(user) {
    if (user === level.player)
      game.appendToConsole(i18n.t("messages.trap-critical-failure"));
    this.trigger();
    if (this.onCriticalFailure)
      this.onCriticalFailure(user);
  }

  onTrapFailure(user) {
    if (user === level.player)
      game.appendToConsole(this.failureMessage);
    if (this.onFailure)
      this.onFailure();
  }

  get successMessage() {
    return !this.disarmed ? i18n.t("messages.trap-disarmed") : i18n.t("messages.trap-armed");
  }
	
  get failureMessage() {
    return !this.disarmed ? i18n.t("messages.trap-disarm-failed") : i18n.t("messages.trap-enable-failed");
  }
}
