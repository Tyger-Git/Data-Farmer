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
export function saveGame() {
    console.log(`Saving game for user: ${gameState.userName}`);
    gameState.lastSave = new Date(); // Update the date before saving
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    allSavedGames[gameState.userName] = gameState;
    localStorage.setItem('savedGames', JSON.stringify(allSavedGames));
    console.log(`Saved game state: ${JSON.stringify(gameState)}`);
}

// Load game state
export function loadGame(username) {
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    return allSavedGames[username] ? Object.assign({}, allSavedGames[username]) : null;
}

export function setUserName(name) {
    gameState.userName = name;
}

export function setGameState(state) {
    console.log(`Previous state: ${JSON.stringify(gameState)}`);
    Object.assign(gameState, state);
    console.log(`New state: ${JSON.stringify(gameState)}`);
}