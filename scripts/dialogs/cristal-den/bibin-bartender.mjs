import {BarkeepHelper} from "../barkeep.mjs";

class Dialog extends BarkeepHelper {
  constructor(dialog) {
    super(dialog, [
      { name: "bibin's brew", price: 2, onDrink: "drunk" },
      { name: "whiskey",      price: 5, onDrink: "drunk" },
      { name: "sparkeCola",   price: 6 }
    ]);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
