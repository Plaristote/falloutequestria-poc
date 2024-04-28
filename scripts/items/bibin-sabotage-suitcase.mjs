import {Consumable} from "./consumable.mjs";
import {onSuitcaseOpened} from "../quests/cristal-den/bibins-sabotage-delivery.mjs";

export class BibinSabotageSuitcase extends Consumable {
  constructor(model) {
    super(model);
  }

  get requiresTarget() {
    return false;
  }

  useOn(target) {
    console.log("Coucou petite perruche ? Ouverture de la suitcase ???");
    try {
    if (!target) {
      target = this.user;
      onSuitcaseOpened();
    }
    target.inventory.addItemOfType("dynamite", 4);
    target.inventory.destroyItem(this.model);
    console.log("C'est bon c'est fini, nan ?");
    } catch (err) {
      console.log("Caught error", err);
    }
    return true;
  }
}
