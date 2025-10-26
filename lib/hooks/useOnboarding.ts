/**
 * Check if user has skipped onboarding recently (within 24h)
 */
export function hasRecentlySkipped(): boolean {
  if (typeof window === 'undefined') return false;

  const skippedTime = localStorage.getItem('onboarding_skipped');
  if (!skippedTime) return false;

  const elapsed = Date.now() - parseInt(skippedTime);
  const twentyFourHours = 24 * 60 * 60 * 1000;

  return elapsed < twentyFourHours;
}

/**
 * Mark onboarding as skipped (expires in 24h)
 */
export function markOnboardingSkipped(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('onboarding_skipped', Date.now().toString());
  }
}

/**
 * Clear skip preference
 */
export function clearOnboardingSkip(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('onboarding_skipped');
  }
}
