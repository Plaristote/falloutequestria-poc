import {
  hasPotiokSpyQuest, learnedAboutPotiokSpyConfession,
  onFoundPotiokSpy, onLearnedAboutPotiokSpyConfession, onLearnedAboutSavageConnection
} from "../../../quests/cristal-den/potioks-spy.mjs";

class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  wasSentByPotioks() {
    return hasPotiokSpyQuest();
  }

  canPassForBibinBand() {
    return game.player.statistics.speech > 70 && game.player.statistics.intelligence >= 5;
  }

  canProbePotiokLeaks() {
    return !learnedAboutPotiokSpyConfession();
  }

  canConvinceToTellAboutConfession() {
    return game.player.statistics.speech > 95;
  }

  onProbing() {
    this.triggerFoundPotiokSpy();
  }

  triggerFoundPotiokSpy() {
    onFoundPotiokSpy();
  }

  onProbeEmployer() {
    onLearnedAboutPotiokSpyConfession();
  }

  onProbeVisitorFurther() {
    onLearnedAboutSavageConnection();
  }

  onConfession() {
    onLearnedAboutPotiokSpyConfession();
  }

  murderNpc() {
    this.dialog.npc.takeDamage(this.dialog.npc.statistics.hitPoints + 1, game.player);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
