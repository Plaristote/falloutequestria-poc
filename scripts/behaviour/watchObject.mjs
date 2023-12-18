export function canGuardPreventInteraction(guard, character) {
  if (guard
   && !guard.unconscious
   && guard.fieldOfView.isDetected(character)
   && !guard.isEnemy(character)) {
    return true;
  }
  return false;
}
