import {stealCheck} from "../cmap/helpers/checks.mjs";

export class ShopShelf {
  constructor(model) {
    this.model = model;
  }
  
  get shopScript() {
    var parent = this.model.parent;

    while (parent && parent.getScriptObject() && !parent.getScriptObject().isShop)
      parent = parent.parent;
    return parent.getScriptObject();
  }

  get shopOwner() {
    return this.shopScript ? this.shopScript.shopOwner : null;
  }
  
  get shopOwnerScript() {
    return this.shopOwner ? this.shopOwner.getScriptObject() : null;
  }

  isUnderSurveillance() {
    return this.shopScript.isUnderSurveillance();
  }

  onUse() {
    const shopOwner = this.shopOwner;

    if (this.isUnderSurveillance())
    {
      level.addTextBubble(shopOwner, "Don't touch that.", 2500, "white");
      return true;
    }
    return false;
  }

  onTakeItem(user, item, quantity) {
    const shopOwner = this.shopOwner;

    if (shopOwner && this.isUnderSurveillance()) {
      return stealCheck(user, shopOwner, item, quantity, {
        failure:         this.onStealFailure.bind(this, user, false, item),
        criticalFailure: this.onStealFailure.bind(this, user, true, item)
      });
    }
    return true;
  }

  onPutItem(user, item, quantity) {
    return this.onTakeItem(user, item, quantity);
  }
  
  onStealFailure(user, critical, item) {
    this.shopScript.onShopliftAttempt(user);
  }
}

export function create(model) {
  return new ShopShelf(model);
}

