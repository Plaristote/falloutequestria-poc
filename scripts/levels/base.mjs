export class LevelBase {
  constructor() {
    this.scenes = [];
    this.model = level;
  }

  appendSceneManager(sceneManager) {
    this.scenes.push(sceneManager);
    level.tasks.addUniqueTask("sceneTick", 1789, 0);
  }

  removeSceneManager(sceneManager) {
    this.scenes.splice(this.scenes.indexOf(sceneManager));
    if (this.scenes.length === 0)
      level.tasks.removeTask("sceneTick");
  }

  sceneTick() {
    this.scenes.forEach(sceneManager => {
      sceneManager.onSceneTick();
    });
  }

  onExit() {
    this.scenes.forEach(sceneManager => {
      sceneManager.onLevelExit();
    });
  }
}

export function create() {
  return new LevelBase;
}
