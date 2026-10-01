export function roundWinners(players, scores) {
  if (!players.length || scores.length !== players.length || scores.some(s => !Number.isFinite(s))) return [];
  const best = Math.max(...scores);
  return players.flatMap((player, index) => scores[index] === best ? [{ player, points: best }] : []);
}
