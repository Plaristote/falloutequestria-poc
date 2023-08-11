export const QuestFlags = {
  NormalQuest: 0, HiddenQuest: 1
};

export function requireQuest(name, flags) {
  if (!game.quests.hasQuest(name))
    game.quests.addQuest(name, QuestFlags.HiddenQuest);
  return game.quests.getQuest(name);
}

export class QuestHelper {
  constructor(model) {
    this.model = model;
  }

  tr(name, options = {}) {
    return i18n.t(`quests.${this.model.name}.${name}`, options);
  }

  onCompleted() {
    if (this.model.failed)
      this.onFailed();
    else
      this.onSuccess();
  }
  
  completeMessage(reward) {
    return i18n.t("messages.quest-complete", {
      title: this.tr("title"),
      xp:    reward
    });
  }

  failedMessage() {
    return i18n.t("messages.quest-failed", {
      title: this.tr("title")
    });
  }

  onSuccess() {
    const reward = this.xpReward || 50;
    game.appendToConsole(this.completeMessage(reward));
    game.player.statistics.addExperience(reward);
  }

  onFailed() {
    game.appendToConsole(this.failedMessage());
  }
}
