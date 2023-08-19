import {BarkeepHelper} from "../barkeep.mjs";

class Dialog extends BarkeepHelper {
  constructor(dialog) {
    super(dialog, [
      { name: "oatmilk",    price: 3 },
      { name: "beer",       price: 4, onDrink: "drunk" },
      { name: "whiskey",    price: 6, onDrink: "drunk" },
      { name: "sparkeCola", price: 8 }
    ]);
  }

  getEntryPoint() {
    if (this.dialog.npc.hasVariable("talked"))
      return "entry";
    this.dialog.npc.setVariable("talked", 1);
    return "meeting";
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
