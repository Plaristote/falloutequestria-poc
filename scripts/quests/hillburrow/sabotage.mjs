import {QuestHelper} from "../helpers.mjs";

const questName = "hillburrow/sabotage";

export class Sabotage extends QuestHelper {
  initialize() {
    this.model.location = "hillburrow";
    this.model.addObjective("findCulprit", this.tr("findCulprit"));
  }

  onPointersGivenByBittyPotiok() {
    this.model.addObjective("talkToMercenaryBoss", this.tr("talkToMercenaryBoss"));
  }

  onMotivesSuggestedByBittyPotiok() {
    this.model.addObjective("confrontBrother", this.tr("confrontBrother"));
  }

  onTalkedWithmercenaryBoss() {
    this.onPointersGivenByBittyPotiok();
    this.model.completeObjective("talkToMercenaryBoss");
  }

  onFoundWaterCarrierDynamite() {
    this.model.addObjective("findWaterCarrierDynamite", this.tr("findWaterCarrierDynamite"));
    this.model.completeObjective("findWaterCarrierDynamite");
  }

  onWaterCarrierConfessed() {
    this.model.addObjective("confession", this.tr("confession"));
    this.model.completeObjective("confession");
  }

  onFigureOutSabotageExplosives() {
    this.model.setVariable("knowsAboutDymamite", 1);
  }

  onLearnAboutSabotageTiming() {
    this.model.setVariable("knowsAboutTiming", 1);
  }

  get knowsAboutDynamite() {
    return this.model.getVariable("knowsAboutDynamite", false);
  }

  get knowsAboutTiming() {
    return this.model.getVariable("knowsAboutTiming", false);
  }

  onSuccess() {
    super.onSuccess();
    game.dataEngine.addReputation("potioks", 45);
    game.dataEngine.addReputation("bibins-band", -20);
  }
}
