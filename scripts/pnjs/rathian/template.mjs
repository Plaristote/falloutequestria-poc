export const rathianTemplate = {
  sheet: "rathian",
  script: "rathian/meeting.mjs",
  uniq: true,
  inventory: {
    slots: {
      "use-1": { hasItem: true, itemType: "laser-gun", ammo: 10, maxAmmo: 10 },
      "armor": { hasItem: true, itemType: "scribe-armor" }
    },
    items: [
      { itemType: "energy-cell", quantity: 64 }
    ]
  }
};
