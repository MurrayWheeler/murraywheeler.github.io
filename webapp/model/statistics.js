"use-strict";


fiveCrowns.statistics = (function () {

    const statisticsLocalStorage = "fiveCrowns.statisticsData";
    var oStatistics = new statisticsClass;

    // Constructor function for statistics object
    function statisticsClass() {

        // Properties
        // ====================================================
        this.totalGames = 0;
        this.incompleteGames = 0;


        // Private Methods
        // ====================================================

        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { day: '2-digit', month: 'short', year: '2-digit' };
            // const userLocale = navigator.language || 'en-NZ'; // Fallback to 'en-NZ' if navigator.language is not available
            var userLocale = navigator.language;
            if (!userLocale) {
                return date.toLocaleDateString(undefined, options);
            } else {
                return date.toLocaleDateString(userLocale);
            }
        }

        // Public Methods
        // ====================================================

        this.getTotalGames = function () {
            return this.totalGames;
        }

        this.setTotalGames = function (totalGames) {
            this.totalGames = totalGames;
        }

        this.calcTotalGames = function () {
            var oGames = fiveCrowns.games.getModel();
            oStatistics.setTotalGames(oGames.game.length);
        }

        this.calcIncompleteGames = function () {
            oStatistics.incompleteGames = 0;
            oStatistics.incompleteList = [];
            var oGames = fiveCrowns.games.getModel();
            for (let gameNum = 0; gameNum < oGames.game.length; gameNum++) {
                if (oGames.game[gameNum].scores[10].roundScores[0] == '') {
                    oStatistics.incompleteGames = oStatistics.incompleteGames + 1;
                    oStatistics.incompleteList.push(gameNum);
                };
            }
        }

        this.calcHighestTotal = function () {
            oStatistics.highestTotalScore = 0;
            var oGames = fiveCrowns.games.getModel();
            for (let gameNum = 0; gameNum < oGames.game.length; gameNum++) {
                for (let playerNum = 0; playerNum < oGames.game[gameNum].playerCount; playerNum++) {
                    var roundScore = 0;
                    for (let roundNum = 0; roundNum < oGames.game[gameNum].scores.length; roundNum++) {
                        roundScore = roundScore + +oGames.game[gameNum].scores[roundNum].roundScores[playerNum];
                    }
                    if (roundScore > oStatistics.highestTotalScore) {
                        oStatistics.highestTotalScore = roundScore;
                        oStatistics.highestTotalGameIndex = gameNum;
                        oStatistics.highestTotalDescription = roundScore + " on " + formatDate(oGames.game[gameNum].gameDate) + " by " + oGames.game[gameNum].players[playerNum].playerName;
                    }
                };
            }
        }

        this.calcLowestTotal = function () {
            oStatistics.lowestTotalScore = 999;
            var oGames = fiveCrowns.games.getModel();
            for (let gameNum = 0; gameNum < oGames.game.length; gameNum++) {
                for (let playerNum = 0; playerNum < oGames.game[gameNum].playerCount; playerNum++) {
                    var roundScore = 0;
                    for (let roundNum = 0; roundNum < oGames.game[gameNum].scores.length; roundNum++) {
                        roundScore = roundScore + +oGames.game[gameNum].scores[roundNum].roundScores[playerNum];
                    }
                    if (roundScore < oStatistics.lowestTotalScore) {
                        oStatistics.lowestTotalScore = roundScore;
                        oStatistics.lowestTotalGameIndex = gameNum;
                        oStatistics.lowestTotalDescription = roundScore + " on " + formatDate(oGames.game[gameNum].gameDate) + " by " + oGames.game[gameNum].players[playerNum].playerName;
                    }
                };
            }
        }

        this.calcHighestRound = function () {
            oStatistics.highestRoundScore = 0;
            var oGames = fiveCrowns.games.getModel();
            for (let gameNum = 0; gameNum < oGames.game.length; gameNum++) {
                for (let playerNum = 0; playerNum < oGames.game[gameNum].playerCount; playerNum++) {
                    for (let roundNum = 0; roundNum < oGames.game[gameNum].scores.length; roundNum++) {
                        roundScore = +oGames.game[gameNum].scores[roundNum].roundScores[playerNum];
                        if (roundScore > oStatistics.highestRoundScore) {
                            oStatistics.highestRoundScore = roundScore;
                            oStatistics.highestRoundGameIndex = gameNum;
                            oStatistics.highestRoundDescription = roundScore + " on " + formatDate(oGames.game[gameNum].gameDate) + " by " + oGames.game[gameNum].players[playerNum].playerName;
                        }
                    }
                };
            }
        }



    };


    // Private Static Methods
    // ====================================================

    function loadStatistics() {
        oStatistics.calcTotalGames();
        oStatistics.calcIncompleteGames();
        oStatistics.calcHighestTotal();
        oStatistics.calcLowestTotal();
        oStatistics.calcHighestRound();
        frmStatistics.getModel().refresh()
    };



    // Public Static Methods
    // ====================================================

    return {

        loadStatistics: loadStatistics,
        oStatistics: oStatistics,


    };

}());

