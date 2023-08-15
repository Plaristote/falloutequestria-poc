import {toggleRoutine} from "./routine.mjs";

export class SceneManager {
  constructor(parent, id) {
    this.parent = parent;
    this.model = parent.model;
    this.id = id;
    if (this.active)
      this.triggerCurrentStep();
  }

  get storageScope() {
    return "scene-" + this.id;
  }

  get active() {
    const current = this.state;
    return current !== null && this.states.length > current;
  }

  get state() {
    return this.model.hasVariable(this.storageScope)
      ? this.model.getVariable(this.storageScope)
      : null;
  }

  set state(value) {
    this.model.setVariable(this.storageScope, value);
  }

  get saveLocked() {
    return this._saveLocked;
  }

  set saveLocked(value) {
    game.saveLock = this._saveLocked = value;
  }

  get actors() {
    return [];
  }

  line(name, options = {}) {
    return i18n.t(`scenes.${this.id}.${name}`, options);
  }

  initialize() {
    this.state = 0;
    this.prepare();
    this.registerSceneManager();
  }

  prepare() {
    const self = this;
    this.actors.forEach(actor => {
      if (actor) {
        toggleRoutine(actor, false);
        if (actor.script)
          actor.script.sceneManager = self;
        else
          console.log("Invalid script on scene actor", actor.displayName);
        actor.actionQueue.reset();
      }
      else
        console.log("Scene", id, "has invalid an actor.");
    });
    this.triggerCurrentStep();
  }

  finalize() {
    if (this.saveLocked)
      this.saveLocked = false;
    this.actors.forEach(actor => {
      toggleRoutine(actor, true);
    });
    this.model.unsetVariable(this.storageScope);
    this.unregisterSceneManager();
    this.state = null;
  }

  registerSceneManager() {
    const script = level.getScriptObject();

    if (script && script.appendSceneManager)
      script.appendSceneManager(this);
  }
  
  unregisterSceneManager() {
    const script = level.getScriptObject();

    if (script && script.removeSceneManager)
      script.removeSceneManager(this);
  }

  triggerNextStep(continuing = true) {
    if (!continuing)
      return ;
    if (this.active) {
      this.state++;
      this.triggerCurrentStep(continuing);
    }
  }

  triggerCurrentStep(continuing = true) {
    if (this.states.length > this.state)
      this.states[this.state](continuing);
    else
      this.finalize();
  }

  onCombatTurn(character) {
  }
  
  onActionQueueCompleted(character) {
  }

  onDied(character) {
  }

  onDamageTaken(character) {
  }

  onSceneTick() {
  }
}
