"use-strict";


fiveCrowns.pageStatisticsController = (function () {

    function displayGame(gameIndex) {
        var oGame = fiveCrowns.games.getModel().game[gameIndex];
        fiveCrowns.pageGameController.setGameEditable(false);
        fiveCrowns.model.setModelValues(oGame);
        fiveCrowns.pageMainController.gotoGame(oApp);
    };


    return {


        onTotalGames: function () {
            requestFullScreen();
            tabGames.getModel().setData(fiveCrowns.games.getModel());
            oApp.to("pageGames", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onIncompleteGames: function () {
            var oStatistics = fiveCrowns.statistics.oStatistics;
            var oGames = fiveCrowns.games.getModel();
            var oIncomplete = { game: [] };
            for (let gameNum = 0; gameNum < oStatistics.incompleteList.length; gameNum++) {
                var oGame = oGames.game[oStatistics.incompleteList[gameNum]];
                oIncomplete.game.push(oGame);
            }
            tabGames.getModel().setData(oIncomplete);
            oApp.to("pageGames", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onHighestScore: function () {
            displayGame(fiveCrowns.statistics.oStatistics.highestTotalGameIndex);
        },

        onLowestScore: function () {
            displayGame(fiveCrowns.statistics.oStatistics.lowestTotalGameIndex);
        },

        onHighestRound: function () {
            displayGame(fiveCrowns.statistics.oStatistics.highestRoundGameIndex);
        },

        onRefresh: function (oApp) {
            fiveCrowns.statistics.loadStatistics();
        },

        onBack: function (oApp) {
            oApp.back();
        },


    };

}());
