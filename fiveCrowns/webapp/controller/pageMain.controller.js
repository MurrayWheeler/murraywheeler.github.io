"use-strict";


fiveCrowns.pageMainController = (function () {

    function gotoGame(oApp) {
        requestFullScreen();
        var players = fiveCrowns.model.getPlayerCount();
        document.getElementById("playerCount-inner").value = players;
        fiveCrowns.pageGameController.hideUnusedPlayers(players);
        tabRounds.getModel().refresh();
        tabPlayers.getModel().refresh();
        fiveCrowns.pageGameController.refreshScreenTotals(players);
        fiveCrowns.pageGameController.refreshPlayerNames(players);
        fiveCrowns.pageGameController.highlightDealer(fiveCrowns.model.getModel());
        fiveCrowns.pageGameController.highlightRound(fiveCrowns.model.getModel());
        if (sap.ui.Device.orientation.portrait) {
            oApp.to("pageGame", fiveCrowns.settings.oSettings.getPageTransition());
        } else {
            oApp.to("pageGameLandscape", fiveCrowns.settings.oSettings.getPageTransition());
        };
    };


    function gotoList(oApp) {
        requestFullScreen();
        tabGames.getModel().setData(fiveCrowns.games.getModel());
        oApp.to("pageGames", fiveCrowns.settings.oSettings.getPageTransition());
    };




    return {

        gotoGame: gotoGame,

        onPlayerCount: function (element) {
            var playerCnt = element.getValue();
            // var elementId = element.getId();
            // oGame = fiveCrowns.model.getModel();
            // oGame.setPlayerCount(playerCount);
            fiveCrowns.model.setPlayerCount(playerCnt);
            var players = fiveCrowns.model.getPlayerCount();
            element.setValue(players);
            hideKeyboard(element.getId() + "-inner");
        },


        onPlayButton: function (oApp) {
            fiveCrowns.model.clearScores();
            fiveCrowns.model.setPlayerCount(playerCount.getValue());   // Get player count from screen
            fiveCrowns.model.newGame();
            fiveCrowns.pageGameController.setGameEditable(true);
            gotoGame(oApp);
        },

        onResumeGame: function (oApp) {
            fiveCrowns.pageGameController.setGameEditable(true);
            gotoGame(oApp);
        },

        onListGames: function (oApp) {
            gotoList(oApp);
        },

        onSettings: function (oApp) {
            requestFullScreen();
            sap.ui.getCore().byId("popoverMain").close()
            oApp.to("pageSettings", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onStatistics: function (oApp) {
            requestFullScreen();
            sap.ui.getCore().byId("popoverMain").close()
            fiveCrowns.statistics.loadStatistics();
            oApp.to("pageStatistics", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onAbout: function (oApp) {
            requestFullScreen();
            sap.ui.getCore().byId("popoverMain").close()
            sap.m.MessageToast.show("Five Crowns\nv1.00.00 (First release)\nDeveloped by:\nMurray Wheeler");
        },

        onInstr: function (oApp) {
            requestFullScreen();
            sap.ui.getCore().byId("popoverMain").close()
            oApp.to("pageInstr", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onBack: function (oApp) {
            window.close();
            // exitFullScreen();

            // If I manage to get the close app to work, I may want to add a confirm dialog

            // For Hybrid Apps (e.g., with Cordova, Capacitor)
            // If your app is packaged as a native or hybrid mobile app using frameworks like Apache Cordova, Capacitor, or similar, you can use plugins to programmatically close the app.

            // Using Cordova
            // Install the cordova-plugin-exit plugin:
            // cordova plugin add cordova-plugin-exit

            // Then, use it in your JavaScript code:
            // navigator.app.exitApp();

        },


    };

}());
