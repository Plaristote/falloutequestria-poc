import {CharacterBehaviour} from "../character.mjs";
import {requireQuest} from "../../quests/helpers.mjs";

export class Cook extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  onDied() {
    game.setVariable("junkvilleCookDied", 1);
  }

  get dialog() {
    if (this.model.tasks.hasTask("headTowardsBattle"))
      return ;
    return "junkville-cook";
  }

  headTowardsBattle() {
    const reached = () => { return this.model.position.x === 17 && this.model.position.y === 1; };
    const model = this.model;

    if (this.model.actionQueue.isEmpty() && !reached()) {
      this.model.actionQueue.pushMovement(17, 1);
      this.model.actionQueue.pushScript(() => {
        if (reached()) {
          game.asyncAdvanceTime(27);
          requireQuest("junkvilleNegociateWithDogs").completed = true;
          model.getScriptObject().onDied();
          level.deleteObject(model);
        }
      });
      this.model.actionQueue.start();
    }
  }
}
