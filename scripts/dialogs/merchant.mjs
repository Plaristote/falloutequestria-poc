import {DialogHelper} from "./helpers.mjs";

export class MerchantHelper extends DialogHelper {
  canBuy(price) {
    return this.dialog.player.inventory.count("bottlecaps") >= price;
  }

  spendMoney(price) {
    this.dialog.player.inventory.removeItemOfType("bottlecaps", price);
  }
}
