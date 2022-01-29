export class LevelBase {
  constructor() {
    this.scenes = [];
  }

  appendSceneManager(sceneManager) {
    this.scenes.push(sceneManager);
  }

  removeSceneManager(sceneManager) {
    this.scenes.splice(this.scenes.indexOf(sceneManager));
  }
	
  onExit() {
    this.scenes.forEach(sceneManager => {
      sceneManager.finalize();
    });
  }
}

export function create() {
  return new LevelBase;
}
