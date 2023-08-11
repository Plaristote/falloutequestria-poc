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
}
