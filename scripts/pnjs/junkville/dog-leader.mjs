import {PackMember} from "./pack-member.mjs";

export class DogLeader extends PackMember {
  constructor(model) {
    super(model);
    this.dialog = "junkville/dog-leader";
  }

  get speakOnDetection() {
    return this.model.getVariable("met") !== true;
  }

  onPlayerCapture() {
  }
}
