"use-strict";


fiveCrowns.games = (function () {

    const gamesLocalStorage = "fiveCrowns.gamesData";
    var oGames = new gamesClass;

    // Constructor function for Games object
    function gamesClass() {

        // Properties
        // ====================================================
        this.game = [];


        // Methods
        // ====================================================

        // this.getPlayerPrefix = function () {
        //     return this.playerPrefix;
        // }

        // this.setPlayerPrefix = function (playerPrefix) {
        //     this.playerPrefix = playerPrefix;
        // }



    };


    // Private Static Methods
    // ====================================================

    function saveGames() {
        // Storing data:
        var gamesJson = JSON.stringify(oGames);
        localStorage.setItem(gamesLocalStorage, gamesJson);
    };

    function loadGames() {
        // Retrieving data:
        let gamesJson = localStorage.getItem(gamesLocalStorage);
        if (!gamesJson) return;
        oGames = JSON.parse(gamesJson);
    };


    function modifyGame(oGame) {
        // Add new, or modfiy, existing game to list of games
        // Look for existing
        var gameIndex = -1;
        for (var gameNum = 0; gameNum < oGames.game.length; gameNum++) {
            if (oGames.game[gameNum].gameId == oGame.gameId) {
                gameIndex = gameNum;
            }
        }
        // Use parse and stringify as assigning an object, assigns the object reference, rather thatn copying the values
        var oTempGame = JSON.parse(JSON.stringify(oGame));
        // Add or Modify
        if (gameIndex == -1 && !isZeroScores(oGame)) {   // Check for zero scores, don't save a new game with all zero scores
            oGames.game.unshift(oTempGame);              // Insert at the front of the array. So the latest appears at the top of the list
        } else {
            oGames.game[gameIndex] = oTempGame;
        }
    };


    function isZeroScores(oGame) {
        // Check if all scores are zero
        var zeroScores = true;
        for (var roundNum = 0; roundNum < oGame.scores.length; roundNum++) {
            for (var playerNum = 0; playerNum < oGame.scores[roundNum].roundScores.length; playerNum++) {
                if (oGame.scores[roundNum].roundScores[playerNum] != '') {
                    zeroScores = false;
                    break;
                }
            }
            if (!zeroScores) {
                break;
            }
        }
        return zeroScores;
    }


    function getNextGameId() {
        // Return the next Game Id. IE Max Id + 1
        if (!oGames.game.length) {
            loadGames();
        }
        let maxId = 0;
        for (let gameNum = 0; gameNum < oGames.game.length; gameNum++) {
            if (oGames.game[gameNum].gameId > maxId) {
                maxId = oGames.game[gameNum].gameId;
            }
        }
        let nextId = maxId + 1;
        return nextId;
    };


    function deleteGameById(gameId) {
        // Delete the selected game
        // Look for first game by gameId (should only be one)
        var gameIndex = -1;
        for (var gameNum = 0; gameNum < oGames.game.length; gameNum++) {
            if (oGames.game[gameNum].gameId == gameId) {
                gameIndex = gameNum;
                break;   // Leave loop when we found the game
            }
        }
        // Remove the game from the list
        if (gameIndex != -1) {
            oGames.game.splice(gameIndex, 1);
        }
    };



    // Public Static Methods
    // ====================================================

    return {

        /**
         * Get model
         */
        getModel: function () {
            return oGames;
        },

        initGames: function () {
            loadGames();
        },

        saveGames: saveGames,
        modifyGame: modifyGame,
        getNextGameId: getNextGameId,
        deleteGameById: deleteGameById,

    };

}());

