import * as Checks from "../../../cmap/helpers/checks.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  loadSlaversErrandQuest() {
    this.slaversErrand = game.quests.getQuest("cristal-den/slavers-errand");
  }

  isSlaversErrandActive() {
    const quest =  game.quests.getQuest("cristal-den/slavers-errand");

    return quest && !quest.isObjectiveCompleted("fetchSlaves");
  }

  slaversErrandCanNegociate() {
    return game.player.statistics.barter >= 72 && this.slaversErrandUnitPrice > 150;
  }

  slaversErrandCanNegociateFurther() {
    return game.player.statistics.barter >= 85;
  }

  slaversErrandCanPay() {
    return game.player.inventory.count("bottlecaps") >= this.slaversErrandPrice;
  }

  get slaversErrandPrice() {
    return this.slaversErrandUnitPrice * 10;
  }

  get slaversErrandUnitPrice() {
    return this.slaversErrand.getVariable("slavePrice", 500);
  }

  get slaversErrandNegociatedPrice_1() { return 400; }
  get slaversErrandNegociatedPrice_2() { return 200; }
  get slaversErrandNegociatedPrice_3() { return 150; }
  get slaversErrandNegociatedPrice_4() { return 100; }

  set slaversErrandUnitPrice(value) {
    this.slaversErrand.setVariable("slavePrice", value);
  }

  onNegociate() {
    this.slaversErrandUnitPrice = this.slaversErrandNegociatedPrice_1;
  }

  onNegociateFurther() {
    this.slaversErrandUnitPrice = this.slaversErrandNegociatedPrice_2;
  }

  onNegociateEvenFurtherBeyond() {
    const winner = Checks.skillContest(game.player, this.dialog.npc, "barter", 50);

    if (winner == game.player) {
      if (game.player.statistics.barter - this.dialog.npc.statistics.barter < 40)
        this.slaversErrandUnitPrice = this.slaversErrandNegociatedPrice_3;
      else
        this.slaversErrandUnitPrice = this.slaversErrandNegociatedPrice_4;
      return "slavers-errand/on-negociate-even-further-beyond";
    }
    return "slavers-errand/on-negociate-failure";
  }

  onSlavesBought() {
    game.player.inventory.removeItemOfType("bottlecaps", this.slaversErrandPrice);
    this.slaversErrand.completeObjective("fetchSlaves");
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
