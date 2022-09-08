import {CharacterBehaviour} from "../character.mjs";
import {helpfulHasDisappeared} from "../../quests/junkville/findHelpful.mjs";

export const sobbingBubbles = [
  {content: i18n.t("bubbles.sobbing-1"), duration: 3000},
  {content: i18n.t("bubbles.sobbing-2"), duration: 3000},
  {content: i18n.t("bubbles.sobbing-3"), duration: 3000}
];

export const greetingsBubbles = [
  {content: i18n.t("bubbles.greetings-1"), duration: 3000},
  {content: i18n.t("bubbles.greetings-2"), duration: 3000},
  {content: i18n.t("bubbles.greetings-3"), duration: 3000}
];

export class HelpfulDad extends CharacterBehaviour {
  constructor(model) {
    super(model);
  }

  get textBubbles() {
    if (helpfulHasDisappeared())
      return sobbingBubbles;
    return greetingsBubbles;
  }
}
