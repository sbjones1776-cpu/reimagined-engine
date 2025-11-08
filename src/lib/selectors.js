// Simple selector utilities for frequently-used derived values

export const getTotalGameStars = (progress = []) =>
  progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);

export const getDailyBonusStars = (dailyChallenges = []) =>
  dailyChallenges.reduce((sum, c) => sum + (c.bonus_stars || 0), 0);

export const getTotalStars = (progress = [], dailyChallenges = []) =>
  getTotalGameStars(progress) + getDailyBonusStars(dailyChallenges);

export const getAvailableStarsFromGame = (progress = [], user) => {
  const total = getTotalGameStars(progress);
  const spent = user?.stars_spent || 0;
  return total - spent;
};

export const getAvailableStars = (progress = [], dailyChallenges = [], user) => {
  const total = getTotalStars(progress, dailyChallenges);
  const spent = user?.stars_spent || 0;
  return total - spent;
};

export const getUserCoins = (user) => user?.coins || 0;
