import {CharacterBehaviour} from "../character.mjs";

const datastore = "stabletech-factory-";
const States = {
  GoToDumps: 0,
  SurfaceBackroom: 1,
  WaitInSurfaceBackroom: 2,
  GoToSurfaceMainRoom: 3,
  ArrivedAtFacility: 4,
  Done: 1000
};

// todo fix turret faction issuue

function backroomComputer() {
  return level.findObject("stabletech-facility.computer#1");
}

function frontDoor() {
  return level.findObject("stabletech-facility.door-exterior");
}

class Rathian extends CharacterBehaviour {
  constructor(model) {
    super(model);
    this.model.tasks.addUniqueTask("autopilot", 3456, 0);
    if (!this.model.hasVariable(`${datastore}-state`))
      this.state = 0;
  }

  get state() { return this.model.getVariable(`${datastore}-state`); }
  set state(value) { this.model.setVariable(`${datastore}-state`, value); }

  autopilot() {
    if (!this.model.actionQueue.isEmpty()) return ;
    console.log("autopilot", this.state);
    switch (this.state) {
    case States.GoToDumps:
      return this.headTowardsDumps();
    case States.SurfaceBackroom:
      return this.headTowardsSurfaceBackroom();
    case States.GoToSurfaceMainRoom:
      return this.goToSurfaceMainRoom();
    case States.ArrivedAtFacility:
      return this.arrivedAtFacility();
    }
  }

  headTowardsDumps() {
    this.model.actionQueue.pushMovement(17, 1);
    this.model.actionQueue.pushScript(this.onReachedDumpsEntryZone.bind(this));
    this.model.actionQueue.start();
  }

  onReachedDumpsEntryZone() {
    if (this.model.position.x === 17 && this.model.position.y === 1) {
      this.state++;
      game.setVariable("rathianGoingToDumps", 2);
      level.deleteObject(this.model);
    }
  }

  headTowardsSurfaceBackroom() {
    const backdoor = level.findObject("stabletech-facility.backdoor");
    const computer = backroomComputer();

    console.log("HEAD TOWARDZ ZURVAce BACKROOM");
    if (this.model.position.y > 145)
      this.model.actionQueue.pushMovement(22, 145);
    if (this.model.position.y > 115)
      this.model.actionQueue.pushMovement(28, 115);
    if (this.model.position.y > 72)
      this.model.actionQueue.pushMovement(29, 72);
    if (this.model.position.y > 29)
      this.model.actionQueue.pushMovement(39, 29);
    this.model.actionQueue.pushReach(backdoor);
    this.model.actionQueue.pushReach(computer);
    this.model.actionQueue.pushScript(this.onFirstTerminalReached.bind(this));
    this.model.actionQueue.start();
  }

  onFirstTerminalReached() {
    const computer = backroomComputer();
    const door = frontDoor();

    if (this.model.getDistance(computer) <= 1) {
      this.state++;
      level.addTextBubble(this.model, i18n.t("junkville-stabletech.rathian-first-computer"), 6565);
      computer.setAnimation("monitor-left-on");
      door.getScriptObject().disableAutoclose();
      door.opened = true;
    }
  }

  onSurfaceMainRoomDoorOpened() {
    if (this.state === States.WaitInSurfaceBackroom) {
      const door = frontDoor();

      this.state++;
      level.addTextBubble(this.model, i18n.t("junkville-stabletech.rathian-head-downstairs"), 4321);
      door.getScriptObject().enableAutoclose();
    }
  }

  goToSurfaceMainRoom() {
    const stairs = level.findObject("stabletech-facility.stairs");
    this.model.actionQueue.pushReach(stairs);
    this.model.actionQueue.start();
  }

  onPlayerGoesDownstairs() {
    if (this.state === States.GoToSurfaceMainRoom)
      game.setVariable("rathianGoingToStabletechFacility", 1);
    else
      game.setVariable("playerLeftRathianInDumps", 1);
    level.deleteObject(this.model);
  }

  arrivedAtFacility() {
    level.addTextBubble(this.model, "Next step not implemented yet !", 1500);
  }

  onPlayerGoesUpstairs() {
    if (this.state === States.Done) {
      game.setVariable("rathianGoingBackToJunkville", 1);
      level.deleteObject(this.model);
    }
  }
}

export function create(model) {
  console.log("CREATING sTABLE TECH vACILITY RATHIAN");
  return new Rathian(model);
}
