export let gameState = {
    userName: "",
    bytes: 0,
    cash: 0,
    cashOutMulti: .0015,
    dFarmers: 0,
    dFarmerSpeedLevel: 1,
    dFarmerUpgradeLevel: 1,
    dFarmerTickIncrement: 1000,
    level: 1,
    exp: 0
};

// Save game state
export function saveGame(username, gameState) {
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    allSavedGames[username] = gameState;
    localStorage.setItem('savedGames', JSON.stringify(allSavedGames));
}

// Load game state
export function loadGame(username) {
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    return allSavedGames[username] || null;
}