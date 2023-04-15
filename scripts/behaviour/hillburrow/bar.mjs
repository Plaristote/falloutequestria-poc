import {Shop} from "../shop.mjs";

const barRoutine = [
  { hour: "9", minute: "0", callback: "openShopRoutine"  },
  { hour: "2", minute: "5", callback: "closeShopRoutine" }
];

export class Bar {
  constructor(model) {
    this.model = model;
  }

  get shopOwner() {
    return level.findObject("barkeeper");
  }

  openShopRoutine() {
    if (this.isShopOwnerConscious()) {
      this.shopOwner.actionQueue.reset();
      this.shopOwner.actionQueue.pushMovement(38, 42);
      this.shopOwner.actionQueue.start();
    }
    super.openShopRoutine();
  }

  closeShopRoutine() {
    if (this.isShopOwnerConscious()) {
      this.shopOwner.actionQueue.reset();
      this.shopOwner.actionQueue.pushMovement(43, 41);
      this.shopOwner.actionQueue.start();
    }
    super.closeShopRoutine();
  }
}
