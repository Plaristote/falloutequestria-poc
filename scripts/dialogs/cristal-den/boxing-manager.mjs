class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  get gym() {
    return this.dialog.npc.parent;
  }

  get openForMatches() {
    return this.gym.script.openForMatches;
  }

  get canPlaceABet() {
    return this.gym.getVariable("betSolved", 1) == 0;
  }

  get hasPendingWonBet() {
    return this.gym.getVariable("betWon", 0) == 1;
  }

  getEntryPoint() {
    if (this.hasPendingWonBet)
      return "bet-earnings";
    if (this.openForMatches) {
      if (!this.dialog.npc.hasVariable("met")) {
        this.dialog.npc.setVariable("met", 1);
        if (game.player.statistics.strength > 8)
          return "introduction-for-strong";
        return "introduction";
      }
      return "boxing-entry";
    }
    return "boxing-closed";
  }

  onAskAboutBets() {
    if (this.openForMatches)
      return "bets"
    return "boxing-closed";
  }

  onAskAboutRing() {
    if (this.openForMatches)
      return "fight";
    return "boxing-closed";
  }

  bets() {
    const fighters = this.gym.script.nextNpcFighters;
    const self = this;

    return {
      text: this.dialog.t("bets", { name1: fighters[0].statistics.name, name2: fighters[1].statistics.name }),
      answers: [
        { symbol: "betOnA", textHook: () => { return this.dialog.t("placeBet", { name: fighters[0].statistics.name }); }, hook: this.onPlaceBet.bind(this, fighters[0]) },
        { symbol: "betOnB", textHook: () => { return this.dialog.t("placeBet", { name: fighters[1].statistics.name }); }, hook: this.onPlaceBet.bind(this, fighters[1]) },
        "exit-bets"
      ]
    };
  }

  onPlaceBet(fighter) {
    this.selectedFighter = fighter;
    return "set-bet-amount";
  }

  setBetAmount() {
    const answers = [];
    const capsCount = game.player.inventory.count("bottlecaps");
    const options = [300,200,100,50,10];

    options.forEach(option => {
      if (capsCount >= option)
        answers.push({ symbol: `bet${option}`, textHook: function() { return `${option}`; }, hook: this.onSetBetAmount.bind(this, option) });
    });
    answers.push("exit-bets");
    return { answers: answers };
  }

  onSetBetAmount(amount) {
    console.log("onSetBetAmount");
    this.gym.script.placeBet(this.selectedFighter, amount);
    game.player.inventory.removeItemOfType("bottlecaps", amount);
    return "bet-accepted";
  }

  get selectedFighterName() {
    return this.selectedFighter.statistics.name;
  }

  get betPotentialGains() {
    return this.gym.getVariable("betAmount") * 2;
  }

  betEarnings() {
    this.gym.removeVariable("betWon");
    game.player.inventory.addItemOfType("bottlecaps", this.betPotentialGains);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
