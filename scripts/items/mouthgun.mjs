import {Gun} from "./gun.mjs";

function newGunshotAnimation(user, target) {
  const shotWidth = 95;
  const margin = 15;
  var   anchorX = user.spritePosition.x;
  var   anchorY = user.spritePosition.y;

  user.lookAt(target);
  switch (user.orientation) {
  case "left":
    anchorX = anchorX - shotWidth + margin;
    anchorY = anchorY + user.clippedRect.height / 2 - 45;
    break ;
  case "right":
    anchorX = anchorX + user.clippedRect.width - margin;
    anchorY = anchorY + user.clippedRect.height / 2 - 45;
    break ;
  }
  return [
    {
      type: "Sprite",
      name: "effects",
      animation: `gunshot-${user.orientation}`,
      fromX: anchorX, fromY: anchorY
    },
    {
      type: "Sprite",
      name: "effects",
      animation: "bullet",
      speed: 800,
      fromX: user.spritePosition.x,
      fromY: user.spritePosition.y,
      toX: target.spritePosition.x,
      toY: target.spritePosition.y
    }
  ];
}

class MouthGun extends Gun {
  constructor(model) {
    super(model);
    this.skill = "smallGuns";
    this.model.maxAmmo = 6;
    this.ammoType = "9mm-ammo";
    this.fireAnimationSound = "gunshot";
    this.newShotAnimation = newGunshotAnimation;
  }

  getDamageRange() {
    return [9, 18];
  }
  
  getRange() {
    return 10;
  }
}

export function create(model) {
  return new MouthGun(model);
}
