export function spriteSheet(model) {
  return {
    cloneOf:    "diamond-dog-white",
    base:       "diamond-dog-white",
    staticBase: "diamond-dog-static",
    color:      model.faceColor
  };
}

export const withFaceColor = true;

export const faces = ["diamond-dog"];

export function onToggled(statistics, toggled) {
  let modifier = toggled ? 1 : -1;
}

export function modifyBaseSkill(characterSheet, name, value) {
  switch (name) {
  case "unarmed":
    return value + 25;
  case "barter":
    return value + 30;
  }
  return value;
}
