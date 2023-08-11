export class DialogHelper {
  constructor(dialog) {
    const levelScript = typeof level !== "undefined" ? level.script : null;

    this.dialog = dialog;
    if (levelScript && levelScript.ambiance)
      this.dialog.ambiance = level.getScriptObject().ambiance;
    //this.updateMood();
  }

  get npcScript() {
    return this.dialog.npc.getScriptObject();
  }

  getDefaultMood() {
    return "neutral";
  }

  updateMood() {
    if (this.dialog.npc.hasVariable("mood"))
      this.dialog.mood = this.dialog.npc.getVariable("mood");
    else
      this.dialog.mood = this.getDefaultMood();
  }

  setPersistentMood(mood) {
    if (mood === this.getDefaultMood())
      this.dialog.npc.unsetVariable("mood");
    else
      this.dialog.npc.setVariable("mood", mood);
    this.updateMood();
  }
  
  barter() {
    this.dialog.tryToBarter();
  }
}
