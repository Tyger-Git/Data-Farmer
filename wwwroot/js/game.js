// Imports
import { gameState, updateGameState,  saveGame, loadGame, username, currentUser } from './gameState.js';

// Load game state from local storage
/* -------------------------------------------------------------------------------------------------------------------------------- */
loadGame(currentUser);
console.log(gameState.userName);

// Wrap the code in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', (event) => {

    // Early Initializations
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    let gamePaused = false;
    let maxCashOut = formatCash(gameState.bytes * gameState.cashOutMulti);
    let autoGenPerSec = gameState.dFarmers / (gameState.dFarmerTickIncrement / 1000); // Per sec calc
    let nextLevelReqExp = ((gameState.level * 100) * (gameState.level ** 3));
    let prevLevelReqExp = 0;
    let currentLevelExp = gameState.exp - prevLevelReqExp;
    let currentLevelReqExp = nextLevelReqExp - prevLevelReqExp;
    let progressPercentage = (currentLevelExp / currentLevelReqExp) * 100; // Calc Progress Percentage
    let dFarmerSpeedNextUpgradeCost = (gameState.dFarmerSpeedLevel ** 2) * 10;
    let dFarmerSpeedNextUpgradeAmnt = (1000 / (gameState.dFarmerSpeedLevel + 1)) / 1000;
    let dFarmerLevelNextUpgradeCost = (gameState.dFarmerUpgradeLevel ** 2) * 10;;
    let dFarmerLevelNextUpgradeAmnt = (gameState.dFarmerUpgradeLevel + 1) ** 3;

    
    // Clock
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    var gameClock;
    function setGameClock() {
        // Clear existing clock if any
        if (gameClock) {
            clearInterval(gameClock);
        }

        // Create new game clock
        gameClock = setInterval(function () {
            if (!gamePaused) {
                const newBytes = gameState.bytes + (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
                const newExp = gameState.exp + (gameState.dFarmers * (gameState.dFarmerUpgradeLevel ** 3));
                updateGameState({
                    bytes: newBytes,
                    exp: newExp,
                });
                updateAll();
            }
        }, gameState.dFarmerTickIncrement);
    }

    // Global Update Function
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function updateAll() {
        levelUpCheck();
        updateTextElements();
        areUpgradesAvailable(gameState.cash);
        updateUpgradeTextElements();
    }

    // Initial Function Calls
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    setGameClock();
    updateAll();

    // Hide Level Elements
    /* -------------------------------------------------------------------------------------------------------------------------------- */

    //Disabled for testing

    document.getElementById('dFarmers').style.display = "none";
    document.getElementById('toggleUpgradesPanelBtn').style.display = "none"
    activateNewLevelElements();
    

    // Initial elements to disable
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true;
    document.getElementById('dFarmerLevelUpgrade-btn').disabled = true;

    // Buttons
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    // Upgrade Panel Button
    let upgradesPanel = document.getElementById('upgradesPanel');
    let toggleUpgradesPanelBtn = document.getElementById('toggleUpgradesPanelBtn');

    toggleUpgradesPanelBtn.addEventListener('click', function () {
        if (upgradesPanel.style.right === "0px") {
            upgradesPanel.style.right = "-500px";
            toggleUpgradesPanelBtn.style.right = "0px";
        } else {
            upgradesPanel.style.right = "0px";
            toggleUpgradesPanelBtn.style.right = "500px";
        }
    });
    // Collect Button
    document.getElementById('collect-btn').addEventListener('click', function () {
        const newBytes = gameState.bytes + 10;
        const newExp = gameState.exp + 10;
        updateGameState({
            bytes: newBytes,
            exp: newExp,
        });
        updateAll();
        saveGame();
    });

    // Cash Out Button
    document.getElementById('cashout-btn').addEventListener('click', function () {
        let cashToAdd = (gameState.bytes * gameState.cashOutMulti);
        let newCash = gameState.cash + cashToAdd;
        updateGameState({
            cash: newCash,
            bytes: 0,
        });
        updateAll();
        saveGame();
    });

    // Upgrade dFarmer Speed
    document.getElementById('dFarmerSpeedUpgrade-btn').addEventListener('click', function () {
        const newCash = gameState.cash - dFarmerSpeedNextUpgradeCost;
        const newSpeedLevel = gameState.dFarmerSpeedLevel + 1;
        const newTickIncrement = 1000 - ((newSpeedLevel - 1) * 100);
        let newSpeedUpgradeAmnt;

        if (newSpeedLevel < 10) {
            newSpeedUpgradeAmnt = ((newSpeedLevel - 1) * 100) / 1000;
        } else {
            newSpeedUpgradeAmnt = 0;
            // Turn button off if max level
            this.disabled = true;
        }

        updateGameState({
            cash: newCash,
            dFarmerSpeedLevel: newSpeedLevel,
            dFarmerTickIncrement: newTickIncrement,
        });

        dFarmerSpeedNextUpgradeAmnt = newSpeedUpgradeAmnt;
        updateAll();
        setGameClock();
        saveGame();
    });

    // Upgrade dFarmer Level
    document.getElementById('dFarmerLevelUpgrade-btn').addEventListener('click', function () {
        const newCash = gameState.cash - dFarmerLevelNextUpgradeCost;
        const newUpgradeLevel = gameState.dFarmerUpgradeLevel + 1;

        if (newUpgradeLevel < 10) {
            dFarmerLevelNextUpgradeAmnt = (newUpgradeLevel + 1) ** 3;
        } else {
            // Turn button off if max level
            this.disabled = true;
        }

        updateGameState({
            cash: newCash,
            dFarmerUpgradeLevel: newUpgradeLevel,
        });

        updateAll();
        saveGame();
    });

    // LevelUp Button "Got It"
    document.getElementById("gotItBtn").onclick = function () {
        document.getElementById("levelUpModal").style.display = "none";
        unPauseGame();
    }

    // Data Farmers
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function calculateAutoGenPerSec(dFarmers, dFarmerTickIncrement) {
        return dFarmers / (dFarmerTickIncrement / 1000);
    }

    document.getElementById('buyDFarmer1-btn').addEventListener('click', function () {
        const newDFarmers = gameState.dFarmers + 1;
        const newAutoGenPerSec = calculateAutoGenPerSec(newDFarmers, gameState.dFarmerTickIncrement);
        updateGameState({
            dFarmers: newDFarmers
        });
        autoGenPerSec = newAutoGenPerSec; // ReCalc Auto Gen
        updateAll();
        saveGame();
    });

    document.getElementById('buyDFarmer10-btn').addEventListener('click', function () {
        const newDFarmers = gameState.dFarmers + 10;
        const newAutoGenPerSec = calculateAutoGenPerSec(newDFarmers, gameState.dFarmerTickIncrement);
        updateGameState({
            dFarmers: newDFarmers
        });
        autoGenPerSec = newAutoGenPerSec; // ReCalc Auto Gen
        updateAll();
        saveGame();
    });

    document.getElementById('buyDFarmer100-btn').addEventListener('click', function () {
        const newDFarmers = gameState.dFarmers + 100;
        const newAutoGenPerSec = calculateAutoGenPerSec(newDFarmers, gameState.dFarmerTickIncrement);
        updateGameState({
            dFarmers: newDFarmers
        });
        autoGenPerSec = newAutoGenPerSec; // ReCalc Auto Gen
        updateAll();
        saveGame();
    });

    //Upgrade Functions
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function areUpgradesAvailable(cash) {
        if (gameState.dFarmers > 0) {
            if (cash >= dFarmerSpeedNextUpgradeCost) { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true; } // dFarmer Speed Upgrade
            if (cash >= dFarmerLevelNextUpgradeCost) { document.getElementById('dFarmerLevelUpgrade-btn').disabled = false; } else { document.getElementById('dFarmerLevelUpgrade-btn').disabled = true; } // dFarmer Level Upgrade
        }
        else {
            document.getElementById('dFarmerSpeedUpgrade-btn').disabled = true;
            document.getElementById('dFarmerLevelUpgrade-btn').disabled = true;
        }
    }

    // Updating Functions
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function updateProgressBar() {
        progressPercentage = (currentLevelExp / currentLevelReqExp) * 100; // ReCalc Progress Percentage
        document.getElementById('expBar').style.width = progressPercentage + "%"; // Update Exp Bar
        document.getElementById('expBar').setAttribute('aria-valuenow', progressPercentage); // Update Exp Bar
    }

    function updateTextElements() {
        document.getElementById('levelText').innerText = `${gameState.level}`; // Update Level Text
        document.getElementById('expCounter').innerText = formatExp(gameState.exp, nextLevelReqExp); // Update Exp Text
        document.getElementById('bCounter').innerText = formatBytes(gameState.bytes);  // Update the counter display
        maxCashOut = formatCash(gameState.bytes * gameState.cashOutMulti); // ReCalc Cash Out Value
        document.getElementById("cashOutVal").innerText = maxCashOut;   // Update the Cash Out Value
        document.getElementById('cashCounter').innerText = formatCash(gameState.cash);  // Update the Total Cash display
        document.getElementById('autoGenText').innerText = formatBytes(autoGenPerSec);    // Update Auto Gen Text
        document.getElementById('dFarmerTotal').innerText = formatAddSuff(gameState.dFarmers); // Update Data Farmer Total
        document.getElementById('userNameDisplay').innerText = `Logged in as : ${gameState.userName}`; // Update User Name Display
    }

    function updateUpgradeTextElements() {

        //DFarmer Upgrade Text
        document.getElementById('dFarmerSpeedLevelText').innerText = `Data Farmer Speed Level : ${gameState.dFarmerSpeedLevel} / 10`; // Update Data Farmer Speed Level
        document.getElementById('dFarmerUpgradeLevelText').innerText = `Data Farmer Upgrade Level : ${gameState.dFarmerUpgradeLevel} / 10`; // Update Data Farmer Upgrade Level
        if (gameState.dFarmerSpeedLevel < 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Increase Speed : ${dFarmerSpeedNextUpgradeAmnt} sec tick rate | Cost : ${formatCash(dFarmerSpeedNextUpgradeCost)}`; // Update Data Farmer Speed Upgrade Cost
        } else if (gameState.dFarmerSpeedLevel === 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Max Speed`; // Maxxed Out
        } else {
            document.getElementById('dFarmerSpeedUpgrade-btn').innerText = `Buy Data Farmers to Enable Upgrades!`; // No dFarmer Case
        }
        if (gameState.dFarmerUpgradeLevel < 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Bytes per tick : +${formatBytes(dFarmerLevelNextUpgradeAmnt)} Cost : ${formatCash(dFarmerLevelNextUpgradeCost)}`; // Update Data Farmer Level Upgrade Cost
        } else if (gameState.dFarmerSpeedLevel === 10 && gameState.dFarmers > 0) {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Max Bytes Per Tick`; // Maxxed out
        } else {
            document.getElementById('dFarmerLevelUpgrade-btn').innerText = `Buy Data Farmers to Enable Upgrades!`; // No dFarmer Case
        }


    }

    // Pausing
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function pauseGame() {
        gamePaused = true;
        saveGame();
    }

    function unPauseGame() {
        gamePaused = false;
        saveGame();
    }


    // Leveling
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    function calculateCurrentLevelExp(exp, prevLevelReqExp) {
        return exp - prevLevelReqExp;
    }

    function calculateCurrentLevelReqExp(nextLevelReqExp, prevLevelReqExp) {
        return nextLevelReqExp - prevLevelReqExp;
    }

    function calculateNextLevelReqExp(level) {
        return ((level * 100) * (level ** 2));
    }

    function levelUpCheck() {
        // Update variables
        const newCurrentLevelExp = calculateCurrentLevelExp(gameState.exp, prevLevelReqExp);
        const newCurrentLevelReqExp = calculateCurrentLevelReqExp(nextLevelReqExp, prevLevelReqExp);

        currentLevelExp = newCurrentLevelExp;
        currentLevelReqExp = newCurrentLevelReqExp;

        updateProgressBar();

        if (gameState.exp >= nextLevelReqExp) {
            const newLevel = gameState.level + 1;
            const newNextLevelReqExp = calculateNextLevelReqExp(newLevel);

            updateGameState({
                level: newLevel
            });

            prevLevelReqExp = nextLevelReqExp; // Set Previous Level Req Exp
            nextLevelReqExp = newNextLevelReqExp; // ReCalc Next Level Req Exp

            updateProgressBar();
            updateTextElements();
            activateNewLevelElements();
            levelUpModal(gameState.level);
        }
    }

    function activateNewLevelElements() {
        switch (gameState.level) {
            case 2:
                document.getElementById('dFarmers').style.display = "flex";
                break;
            case 3:
                document.getElementById('toggleUpgradesPanelBtn').style.display = "block";
                break;
        }
    }

    const levelUpMsg = [
        "You've unlocked Freelance Data Farmers! For an upfront cost, you can now hire freelance data miners to help gather data from the web. These freelance workers will automatically produce data over time. Outsourcing baby!",
        "You've unlocked the Upgrades panel! Here you can purchase upgrades for all sorts of things. Check out the tab to the right!",
        "4",
        "5"
    ];

    function levelUpModal(level) {
        pauseGame();
        document.getElementById('levelUpModalHeader').textContent = `Congratulations, you've reached level ${level}!`;
        document.getElementById('levelUpModalText').textContent = levelUpMsg[level - 2];
        document.getElementById('levelUpModal').style.display = "block";
    }


    // Formatting Funtions:
    /* -------------------------------------------------------------------------------------------------------------------------------- */
    // Byte Formatting Array
    const units = [
        { name: 'Bytes', limit: 1000 },
        { name: 'kB', limit: 1000 ** 2 },
        { name: 'MB', limit: 1000 ** 3 },
        { name: 'GB', limit: 1000 ** 4 },
        { name: 'TB', limit: 1000 ** 5 },
        { name: 'PB', limit: 1000 ** 6 },
        { name: 'EB', limit: 1000 ** 7 },
        { name: 'ZB', limit: 1000 ** 8 },
        { name: 'YB', limit: 1000 ** 9 },
        { name: 'RB', limit: 1000 ** 10 },
        { name: 'QB', limit: Infinity }
    ];
    function formatBytes(bytes) {
        // handle the special case of less than 1 kB in bytes
        if (bytes < 1000) {
            return `${bytes} Bytes`;
        }

        // for amounts of 1 kB and more, find the appropriate unit
        let unitIndex = 1;
        while (bytes >= units[unitIndex].limit) {
            unitIndex++;
        }

        // calculate the amount in the chosen unit
        const amountInUnit = bytes / units[unitIndex - 1].limit;

        // return a string with the amount rounded to two decimal places, followed by the unit
        return `${amountInUnit.toFixed(2)} ${units[unitIndex].name}`;
    }

    function formatExp(exp,nextLevelReq) {return `${exp} / ${nextLevelReq}`;}

    function formatCash(cash) {
        let i = 0;
        const suffixes = ['', 'K', 'M', 'B', 'T'];

        while (cash >= 1000 && i < suffixes.length) {
            cash /= 1000;
            i++;
        }
        return `$${cash.toFixed(2)} ${suffixes[i]}`;
    }

    function formatAddSuff(num) {
        let i = 0;
        const suffixes = ['M', 'B', 'T'];
        while (num >= 1000000000 && i < suffixes.length) {
            num /= 1000;
            i++;
        }
        if (num < 1000000) {
            return num.toLocaleString('en-US');
        } else {
            return `${num.toFixed(2)} ${suffixes[i]}`;
        }
    }

    // Force a save on window close
    window.addEventListener('beforeunload', function (event) {
        saveGame();
    });

    // Reloading window
    window.onunload = function () { saveGame(); }
    window.onload = function () { loadGame(currentUser); }

    // Log out button
    document.getElementById('logout-Btn').addEventListener('click', function () {
        saveGame();
        window.location.href = "index.html";
    });

});

//End of game.js