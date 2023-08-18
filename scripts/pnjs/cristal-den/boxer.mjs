import {CharacterBehaviour} from "../character.mjs";

export class Boxer extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get gym() {
    return this.model.parent;
  }

  get isFightingInRing() {
    return this.gym.script.combatOngoing && this.gym.script.ringCharacters.indexOf(this.model) >= 0;
  }

  mitigateDamage(damage, dealer) {
    if (dealer == game.player && this.isFightingInRing) {
      if (this.model.statistics.hitPoints <= damage) {
        this.shouldTriggerPlayerVictory = true;
        return this.model.statistics.hitPoints - 1;
      }
    }
    return damage;
  }

  onDamageTaken(damage, dealer) {
    super.onDamageTaken(damage, dealer);
    if (this.shouldTriggerPlayerVictory) {
      this.shouldTriggerPlayerVictory = false;
      this.model.addBuff("ko");
      this.gym.script.onPlayerWinsCombat();
    }
  }

  onDied() {
    super.onDied();
    if (this.isFightingInRing)
      this.gym.script.onPlayerWinsCombat();
  }

  onPlayerBeaten() {
    this.gym.script.onPlayerLosesCombat(this.model);
  }
}
