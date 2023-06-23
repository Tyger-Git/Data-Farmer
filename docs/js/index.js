// Imports
/* -------------------------------------------------------------------------------------------------------------------------------- */
import { newGameState, updateGameState, saveGame, loadGame, username, setUserName } from './gameState.js';

// Wrap it up
document.addEventListener('DOMContentLoaded', (event) => {

    let newGameModal = document.getElementById('newGameModal');
    let loadGameModal = document.getElementById('loadGameModal');

    //Handler for Skip Login button (DEV SKIP)
    document.getElementById('skip-login').addEventListener('click', function () {
        window.location.href = 'game.html';
    });

    // New Game Modal
    document.getElementById('newGameBtn').addEventListener('click', function () {
        document.body.classList.add('modal-open');
        newGameModal.style.display = 'block';
        newGameModal.querySelector('.modal-content').classList.add('in');
    });

    // Load Game Modal
    document.getElementById('loadGameBtn').addEventListener('click', function () {
        document.body.classList.add('modal-open');
        loadGameModal.style.display = 'block';
        loadGameModal.querySelector('.modal-content').classList.add('in');
        updateSavedGamesList(); // Update list when Load Game Modal is opened
    });

    // Start new game
    document.getElementById('startNewGameBtn').addEventListener('click', function () {
        setUserName(document.getElementById('usernameInput').value);
        console.log("username :" + username);
        if (username) {
            newGameState();
            console.log("username :" + username);
            newGameModal.style.display = 'none';
            window.location.href = 'game.html';
        } else {
            alert("Please enter a username!");
        }
    });

    // Load saved game
    document.getElementById('loadSavedGameBtn').addEventListener('click', function () {
        let selectedGame = document.querySelector('input[name="savedGame"]:checked');
        if (selectedGame) {
            setUserName(selectedGame.value); // Extract the username directly from the value of the selected radio button
            let loadedState = loadGame(username);
            if (loadedState) {
                updateGameState({ ...loadedState });
                loadGameModal.style.display = 'none';
                window.location.href = 'game.html';
            } else {
                // Handle case where save does not exist
            }
        } else {
            // Handle case where no save is selected
            // Show an error message or otherwise notify the user
        }
    });

    // Delete the Selected Save
    document.getElementById('deleteSavedGameBtn').addEventListener('click', function () {
        let selectedGame = document.querySelector('input[name="savedGame"]:checked');
        if (selectedGame) {
            let confirmResult = window.confirm('Are you sure you want to delete this save?');
            if (confirmResult) {
                let usernameToDelete = selectedGame.value; // Extract the username directly from the value of the selected radio button
                let savedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
                delete savedGames[usernameToDelete];
                localStorage.setItem('savedGames', JSON.stringify(savedGames));
                updateSavedGamesList(); // Update list after a game is deleted
            }
        } else {
            // Handle case where no save is selected
        }
    });

    // Update Saved Games List
    function updateSavedGamesList() {
        let allSavedGames = JSON.parse(localStorage.getItem('savedGames')) || {};
        let savedGameNames = Object.keys(allSavedGames);
        let modalContent = loadGameModal.getElementsByClassName('modal-content')[0];
        // Remove old save list
        let oldSaveList = modalContent.getElementsByTagName('ul')[0];
        if (oldSaveList) modalContent.removeChild(oldSaveList);
        // Create new save list
        let saveList = document.createElement('ul');
        for (let name of savedGameNames) {
            let listItem = document.createElement('li');
            let radioItem = document.createElement('input');
            radioItem.setAttribute('type', 'radio');
            radioItem.setAttribute('name', 'savedGame');
            radioItem.setAttribute('value', name);

            let gameData = allSavedGames[name];
            let dateOfSave = new Date(gameData.lastSave);
            let dateStr = dateOfSave.toLocaleDateString();
            let timeStr = dateOfSave.toLocaleTimeString();
            let level = gameData.level;
            listItem.appendChild(radioItem);
            listItem.appendChild(document.createTextNode(`${name} || Level ${level} || Last Played: ${dateStr} (${timeStr})`));

            saveList.appendChild(listItem);
        }
        modalContent.appendChild(saveList);
    }

    // Close modals
    function closeModal(modal) {
        let modalContent = modal.querySelector('.modal-content');
        modalContent.classList.replace('in', 'out');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            modalContent.classList.remove('out');
        }, 500); // match this with the duration of your slideUpOut animation
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == newGameModal) {
            closeModal(newGameModal);
        }
        if (event.target == loadGameModal) {
            closeModal(loadGameModal);
        }
    }
});