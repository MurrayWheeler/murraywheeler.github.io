"use-strict";

var fiveCrowns = {};

fiveCrowns.model = (function () {

    const maxPlayers = 7;
    const maxRounds = 11;
    const playerPrefix = "P";
    const gameLocalStorage = "fiveCrowns.gameData";

    // var oPlayer = new Object;
    // var aPlayers = new Array;
    var oApp = {};
    var oGame = new Object;
    var oReorder = { players: [{ playerPosition: 0, playerName: '' }] };
    var oChangeDealer = { players: [{ selected: false, playerName: '' }] };

    // Constructor function for Game object
    function Game(gameName) {

        // Properties
        // ====================================================
        // this.gameId = 1;
        this.gameId = fiveCrowns.games.getNextGameId();
        this.gameDate = new Date();
        this.gameName = this.gameDate.toString().substring(0, 24);
        this.initialDealer = 0;     // Array index. IE zero is the first player
        this.currentDealer = 0;     // Array index
        this.currentRound = 0;      // Array index
        this.playerCount = 0;
        this.players = new Array;
        for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
            this.players.push({
                playerPosition: playerNum + 1,
                playerId: 0,
                playerName: '',
                // playerName: defaultPlayerName(playerNum),
                r0: '', r1: '', r2: '', r3: '', r4: '', r5: '', r6: '', r7: '', r8: '', r9: '', r10: '',
                t0: 0
            });
        };
        // Scores: 11 rounds x maxPlayers
        this.rounds = new Array;
        for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
            roundName = getRoundName(roundNum);
            this.rounds.push({ round: roundName, s0: '', s1: '', s2: '', s3: '', s4: '', s5: '', s6: '', s7: '' });
        };
        // Scores: 11 rounds x maxPlayers
        this.scores = new Array;
        for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
            roundScores = new Array;
            for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
                roundScores.push('');
            };
            this.scores.push({ roundScores: roundScores });
        };

        this.totals = new Array;
        for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
            this.totals.push(0);
        };


        // Methods
        // ====================================================

        // Set game name
        this.setGameName = function (gameName) {
            this.gameName = gameName;
        }

        // Set player name
        this.setPlayerName = function (player, playerName) {
            thisPlayer = this.players[player];
            thisPlayer.playerName = playerName;
        }

        // Set current round
        this.setCurrentRound = function (roundNum) {
            this.currentRound = roundNum;
        }

        // Get current round
        this.getCurrentRound = function () {
            return this.currentRound;
        }

        // Set score
        this.setScore = function (round, player, score) {
            thisRound = this.scores[round];
            thisRound.roundScores[player] = score;
            this.setStaticScore(round, player);
        };

        // Set score
        this.setStaticScore = function (roundNum, playerNum) {
            var thisScores = this.scores[roundNum];
            var score = thisScores.roundScores[playerNum];
            var thisRound = this.rounds[roundNum];
            var thisPlayer = this.players[playerNum];
            switch (playerNum) {
                case 0: thisRound.s0 = score; break;
                case 1: thisRound.s1 = score; break;
                case 2: thisRound.s2 = score; break;
                case 3: thisRound.s3 = score; break;
                case 4: thisRound.s4 = score; break;
                case 5: thisRound.s5 = score; break;
                case 6: thisRound.s6 = score; break;
                case 7: thisRound.s7 = score; break;
                default:
            }
            switch (roundNum) {
                case 0: thisPlayer.r0 = score; break;
                case 1: thisPlayer.r1 = score; break;
                case 2: thisPlayer.r2 = score; break;
                case 3: thisPlayer.r3 = score; break;
                case 4: thisPlayer.r4 = score; break;
                case 5: thisPlayer.r5 = score; break;
                case 6: thisPlayer.r6 = score; break;
                case 7: thisPlayer.r7 = score; break;
                case 8: thisPlayer.r8 = score; break;
                case 9: thisPlayer.r9 = score; break;
                case 10: thisPlayer.r10 = score; break;
                default:
            }
        };

        // Set static score
        this.setStaticScores = function () {
            for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
                for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
                    this.setStaticScore(roundNum, playerNum);
                };
            };
        };

        this.setInitialDealer = function (initialDealer) {
            oGame.initialDealer = initialDealer;
        };

        this.setCurrentDealer = function (currentDealer) {
            oGame.currentDealer = currentDealer;
        };



    };



    // Get round name
    function getRoundName(roundNum) {
        if (roundNum <= 7) {
            roundNumText = roundNum + 3;
            // roundName = 'Rnd' + roundNumText;
            roundName = roundNumText;
        } else {
            switch (roundNum) {
                case 8: roundName = 'Jack'; break;
                case 9: roundName = 'Queen'; break;
                case 10: roundName = 'King'; break;
                default:
            };
        };
        return roundName;
    }

    function createApp() {
        oApp = new sap.m.App("myApp", { initialPage: "pageMain" });
    };

    function createGame() {
        oGame = new Game();
    };

    function clearTotals() {
        for (let playerNum = 0; playerNum < oGame.totals.length; playerNum++) {
            oGame.totals[playerNum] = 0;
            oGame.players[playerNum].t0 = 0;
        }
    };

    function defaultPlayerName(playerNum) {
        var playerNumber = playerNum + 1;
        // var playerName = playerPrefix + playerNumber;
        // This is generated at the initial load. IE Need to reload the app to see new prefix
        var playerName = fiveCrowns.settings.oSettings.getPlayerPrefix() + playerNumber;
        return playerName;
    };

    function updatePlayerPositions() {
        for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
            oGame.players[playerNum].playerPosition = playerNum + 1;
        };
    };



    function loadSavedData() {
        loadGame();
    };

    function saveGame(oGame) {
        // Storing data:
        var gameJson = JSON.stringify(oGame);
        localStorage.setItem(gameLocalStorage, gameJson);
    };

    function loadGame() {
        // Retrieving data:
        let gameJson = localStorage.getItem(gameLocalStorage);
        if (!gameJson) return;
        let oGameValues = JSON.parse(gameJson);
        fiveCrowns.model.setModelValues(oGameValues);
    };




    return {

        saveGame: saveGame,

        /**
         * Initialise model
         */
        init: function () {
            fiveCrowns.settings.initSettings();
            fiveCrowns.games.initGames();
            createApp();
            createGame();
            loadSavedData();
            fiveCrowns.eventHandler.registerEvents();
            // fiveCrowns.eventHandler.registerEvents(oEvent);
        },

        /**
         * Set app
         */
        setApp: function (oApp) {
            oApp = oApp;
        },

        /**
         * Get app
         */
        getApp: function () {
            return oApp;
        },

        /**
         * Set model
         */
        setModel: function (oModel) {
            oGame = oModel;
        },

        /**
         * Set model values
         */
        setModelValues: function (oGameValues) {
            for (const propertyName of Object.keys(oGameValues)) {
                if (propertyName in oGame) {
                    oGame[propertyName] = oGameValues[propertyName];
                }
            }
        },

        /**
         * Get model
         */
        getModel: function () {
            return oGame;
        },

        /**
         * Set reorder model
         */
        setReorderModel: function (oModel) {
            oReorder = oModel;
        },

        /**
         * Get reorder model
         */
        getReorderModel: function () {
            return oReorder;
        },

        /**
         * Set change dealer model
         */
        setChangeDealerModel: function (oModel) {
            oChangeDealer = oModel;
        },

        /**
         * Get change dealer model
         */
        getChangeDealerModel: function () {
            return oChangeDealer;
        },

        /**
         * Get max players
         */
        getMaxPlayers: function () {
            return maxPlayers;
        },

        /**
         * Get max rounds
         */
        getMaxRounds: function () {
            return maxRounds;
        },

        /**
         * Get player count
         */
        getPlayerCount: function () {
            return oGame.playerCount;
        },

        /**
         * Set player count
         */
        setPlayerCount: function (players) {
            oGame.playerCount = Number(players);
            if (oGame.playerCount < 0) oGame.playerCount = 0;
            if (oGame.playerCount > maxPlayers) oGame.playerCount = maxPlayers;
        },

        /**
         * Get default player name
         */
        getDefaultPlayerName: function (playerNum) {
            return defaultPlayerName(playerNum);
        },



        clearScores: function () {
            clearTotals(oGame.totals);
            for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
                rounds = oGame.rounds[roundNum];
                scores = oGame.scores[roundNum];
                for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
                    scores.roundScores[playerNum] = '';
                };
            }
            oGame.setStaticScores();
            oGame.currentDealer = 0;
            oGame.initialDealer = 0;
            oGame.currentRound = 0;
        },

        
        newGame: function () {
            // Create a new Game Id and Name
            oGame.gameId = fiveCrowns.games.getNextGameId();
            oGame.gameDate = new Date();
            oGame.gameName = oGame.gameDate.toString().substring(0, 24);
        },


        updateTotals: function () {
            clearTotals();
            for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
                scores = oGame.scores[roundNum];
                for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
                    oGame.totals[playerNum] = oGame.totals[playerNum] + Number(scores.roundScores[playerNum]);
                };
            }
            for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
                oGame.players[playerNum].t0 = oGame.totals[playerNum];
            };
        },

        updatePlayerName: function (playerNum, playerName) {
            oGame.players[playerNum].playerName = playerName;
        },

        updatePlayerPosition: function (currentRow, newPosition) {
            var newRow = newPosition - 1;
            if (newRow < 0) newRow = 0;
            if (newRow >= oGame.playerCount) newRow = oGame.playerCount - 1;
            var removeRow = currentRow;
            var insertRow = newRow
            if (newRow < currentRow) {
                removeRow++;
            } else {
                insertRow++;
            };
            oGame.players.splice(insertRow, 0, oGame.players[currentRow]);
            oGame.players.splice(removeRow, 1);
            for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
                oGame.scores[roundNum].roundScores.splice(insertRow, 0, oGame.scores[roundNum].roundScores[currentRow]);
                oGame.scores[roundNum].roundScores.splice(removeRow, 1);
            }
            updatePlayerPositions();
            oGame.setStaticScores();
            fiveCrowns.model.updateTotals();
        },


    };

}());

