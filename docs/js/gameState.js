export let username;
export let currentUser = localStorage.getItem('currentUser');

export let gameState = {
    userName: username,
    bytes: 0,
    cash: 0,
    cashOutMulti: 1.0025,
    dFarmers: 0,
    dFarmerSpeedLevel: 1,
    dFarmerUpgradeLevel: 1,
    dFarmerTickIncrement: 1100,
    collectDataUpgradeLevel: 1,
    level: 1,
    exp: 0,
    lastSave: new Date()
};

export function setUserName(name) {
    username = name;
    gameState.userName = name;
    currentUser = name;
    console.log("Usernames set to: " + name);
    saveCurrentUser();
}

export function saveCurrentUser() {
    localStorage.setItem('currentUser', currentUser);
    console.log(`Current User Saved: ${currentUser}`);
}

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
    console.log(`Loading game for user: ${username}. Current user: ${currentUser}`);
    let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
    if (allSavedGames[username]) {
        Object.assign(gameState, allSavedGames[username]);
        console.log(`Loaded game state: ${JSON.stringify(gameState)}`);
    } else {
        console.log('No saved game state found for this user.');
        alert("No saved game state found for this user. See console for details.");
    }
}

export function newGameState() {
    Object.assign(gameState, {
        userName: currentUser,
        bytes: 0,
        cash: 0,
        cashOutMulti: 1.0025,
        dFarmers: 0,
        dFarmerSpeedLevel: 1,
        dFarmerUpgradeLevel: 1,
        dFarmerTickIncrement: 1100,
        level: 1,
        exp: 0,
        lastSave: new Date()
    });
    saveGame();
    console.log(`New game state created: ${JSON.stringify(gameState)}`);
}

export function updateGameState(state) {
    Object.assign(gameState, state);
}