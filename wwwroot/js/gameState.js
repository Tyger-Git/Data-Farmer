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
    exp: 0,
    lastSave: new Date()
};

// Save game state
// Save game state
export function saveGame() {
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    allSavedGames[gameState.userName] = gameState;
    localStorage.setItem('savedGames', JSON.stringify(allSavedGames));
    gameState.lastSave = new Date();
}

// Load game state
export function loadGame(username) {
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    return allSavedGames[username] || null;
}

export function setUserName(name) {
    gameState.userName = name;
}

export function setGameState(state) {
    Object.assign(gameState, state);
}