export class ZoneEffectComponent {
  constructor(parent, object) {
    const { zone, scope, interval } = object;
    this.parent = parent;
    this.zone = zone;
    this.scope = scope || "component";
    this.interval = interval || 5432;
    this.functionName = `${this.scope}ZoneEffectRunner`;
    this.parent[this.functionName] = this.triggerZoneEffect.bind(this);
  }

  enable() {
    level.tasks.addUniqueTask(this.functionName, this.interval, 0);
  }

  disable() {
    level.tasks.removeTask(this.functionName);
  }

  isEnabled() {
    level.tasks.hasTask(this.functionName);
  }

  onZoneEntered(zoneName, object) {
    if (this.zone.name === zoneName && this.isEnabled()) this.applyEffectOn(object);
  }

  triggerZoneEffect() {
    level.getZoneOccupants(this.zone).forEach(this.applyEffectOn.bind(this));
  }

  applyEffectOn(object) {
    console.warn("ZoneEffectComponent::applyEffectOn not implemented");
  }
}
