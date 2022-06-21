class Dialog {
  constructor(dialog) {
    this.dialog = dialog;
    this.introduced = level.hasVariable("introduced");
    level.setVariable("introduced", true);
  }

  getEntryPoint() {
    if (this.introduced)
      return "accompany";
    this.dialog.setVariable("met", true);
    return "introduction";
  }

  onComeWith() {
    console.log("onComeWith called");
    console.log("onComeWith:", level.getScriptObject());
    console.log("onComeWith:", level.getScriptObject().playerJoinsRathian);
    level.getScriptObject().playerJoinsRathian();
  }

  onJoinParty() {
    level.getScriptObject().rathianJoinsPlayer();
    this.dialog.npc.getScriptObject().startFollowingPlayer();
  }

  accompany() {
    if (this.introduced)
      return i18n.t("dialogs.rathian-introduction.accompany-again");
    this.onJunkvilleDisclosed();
    return i18n.t("dialogs.rathian-introduction.accompany");
  }

  onJunkvilleDisclosed() {
    worldmap.revealCity("junkville");
  }

  onStableDisclosed() {
    game.setVariable("rathian-knows-stable-location", true);
  }
  
  onTalkedAboutDevice() {
    this.dialog.npc.setVariable("talked-about-device", true);
  }
}

export function create(dialog) {
  return new Dialog(dialog);
}
