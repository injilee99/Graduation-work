// gameDetail.js (게임 상세 페이지 스크립트)
document.addEventListener('DOMContentLoaded', () => {
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  if (gameId) {
    addRecentGame(gameId);
  }
});

function addRecentGame(gameId) {
  const recentGames = JSON.parse(localStorage.getItem('recentGames')) || [];
  if (!recentGames.includes(gameId)) {
    recentGames.push(gameId);
    if (recentGames.length > 5) recentGames.shift(); // 최대 5개까지만 저장
    localStorage.setItem('recentGames', JSON.stringify(recentGames));
  }
}
