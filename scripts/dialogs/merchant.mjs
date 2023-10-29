import {DialogHelper} from "./helpers.mjs";

export function makeOrderChoice(self, item, options) {
  return {
    symbol:        `order-${options.type}-${item.name}`,
    textHook:      options.textHook,
    availableHook: self.canOrderItem.bind(self, item),
    hook:          options.hook.bind(self, item)
  };
}

export class MerchantHelper extends DialogHelper {
  canBuy(price) {
    return this.dialog.player.inventory.count("bottlecaps") >= price;
  }

  canOrderItem(item) {
    return this.canBuy(item.price);
  }

  spendMoney(price) {
    this.dialog.player.inventory.removeItemOfType("bottlecaps", price);
  }

  orderConsumible(item) {
    this.spendMoney(item.price);
    switch (typeof item.onConsume) {
      case "function":
        item.onConsume();
        break ;
      case "undefined":
        game.asyncAdvanceTime(1);
        break ;
      default:
        this.onConsume(item.onConsume);
    }
  }

  onConsume(type) {
    console.log("Merchant::onConsume: unsupported type", type);
  }
}
