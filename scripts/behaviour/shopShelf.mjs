import {OwnedStorage} from "./ownedStorage.mjs";

export class ShopShelf extends OwnedStorage {
  constructor(model) {
    super(model);
  }

  get storageOwners() {
    return [ this.shopOwner ];
  }

  get withRestrictedAccess() {
    return this.isUnderSurveillance();
  }
  
  get shopScript() {
    var parent = this.model.parent;

    while (parent && parent.script && !parent.script.isShop)
      parent = parent.parent;
    return parent.script;
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

  onStealFailure(guard, user, critical, item) {
    this.shopScript.onShopliftAttempt(user);
  }
}

export function create(model) {
  return new ShopShelf(model);
}

