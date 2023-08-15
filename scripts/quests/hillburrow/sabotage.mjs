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

  startWaterCarrierScene() {
    const self = this;

    if (level.name == "hillburrow-backtown")
      this.setupWaterCarrierScene();
    else
    {
      game.switchToLevel("hillburrow-backtown", "", function() {
        self.setupWaterCarrierScene();
      });
    }
  }

  setupWaterCarrierScene() {
    level.script.waterCarrierInterrogationScene.initialize();
  }

  get knowsAboutDynamite() {
    return this.model.getVariable("knowsAboutDynamite", 0) == 1;
  }

  get knowsAboutTiming() {
    return this.model.getVariable("knowsAboutTiming", 0) == 1;
  }

  get knowsAboutBibinInvolvment() {
    return this.model.getVariable("bibinFoundOut", 0) == 1;
  }

  get knowsAboutWaterCariedToSlaves() {
    return false; // TODO
  }

  get canWarnPotioksAboutBibin() {
    return this.model.getVariable("mustWarnPotioksAboutBibin", 0) == 1;
  }

  get foughtWaterCarrier() {
    return this.model.getVariable("foughtHobo", 0) == 1;
  }

  completeWaterCarrierRoute() {
    this.model.completeObjective("findCulprit");
    this.model.completed = true;
  }

  onSuccess() {
    super.onSuccess();
    game.dataEngine.addReputation("potioks", 45);
    game.dataEngine.addReputation("bibins-band", -20);
  }
}
