import {stealCheck} from "../cmap/helpers/checks.mjs";
import {canGuardPreventInteraction} from "./watchObject.mjs";

const forbidTextBubbles = [
  { content: i18n.t("bubbles.forbid-rummaging-1"), duration: 2950 },
  { content: i18n.t("bubbles.forbid-rummaging-2"), duration: 2950 },
  { content: i18n.t("bubbles.forbid-rummaging-3"), duration: 2950 }
];

export class OwnedStorage {
  constructor(model) {
    this.model = model;
  }

  get storageOwners() {
    return this.model.parent.find(object => {
      return object.type === "Character";
    });
  }

  get withRestrictedAccess() {
    return true;
  }

  findMonitoringOwner() {
    const guards = this.storageOwners;
    for (let i = 0 ; i < guards.length ; ++i) {
      if (canGuardPreventInteraction(guard[i])) {
        return guard[i];
      }
    }
    return null;
  }

  onUse() {
    if (this.withRestrictedAccess) {
      const guard = this.findMonitoringOwner();

      if (guard) {
        guard.script.displayRandomTextBubble(
          forbidTextBubbles
        );
        return true;
      }
    }
    return false;
  }

  onTakeItem(user, item, quantity) {
    if (this.withRestrictedAccess) {
      const guard = this.findMonitoringOwner();

      return stealCheck(user, guard, item, quantity, {
        failure:         this.onStealFailure.bind(this, guard, user, false, item),
        criticalFailure: this.onStealFailure.bind(this, guard, user, true, item)
      });
    }
    return true;
  }

  onPutItem(user, item, quantity) {
    return this.onTakeItem(user, item, quantity);
  }

  onStealFailure(guard, user, critical, item) {
    guard.script.displayRandomTextBubble(
      forbidTextBubbles
    );
  }
}

export function create(model) {
  return new OwnedStorage(model);
}
