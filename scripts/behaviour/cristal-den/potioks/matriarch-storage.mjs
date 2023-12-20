import {OwnedStorage} from "../../ownedStorage.mjs";

export class MatriarchStorage extends OwnedStorage {
  get storageOwners() {
    return level.find(object => {
      return object.type === "Character" && object.characterSheet === "cristal-den/potioks/matriarch";
    });
  }
}
