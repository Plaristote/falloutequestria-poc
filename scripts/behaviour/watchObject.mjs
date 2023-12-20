export function canGuardPreventInteraction(guard, character) {
  if (guard
   && !guard.unconscious
   && guard.fieldOfView.isDetected(character)
   && !guard.isEnemy(character)) {
    return true;
  }
  return false;
}

export function canPreventSteal(guard, character) {
  if (guard
   && !guard.unconscious
   && guard.hasLineOfSight(character)) {
    return true;
  }
  return false;
}
