"use-strict";


fiveCrowns.pageMainController = (function () {

    function gotoGame(oApp) {
        requestFullScreen();
        const players = fiveCrowns.model.getPlayerCount();
        sap.ui.getCore().byId("playerCount").setValue(players);
        fiveCrowns.pageGameController.hideUnusedPlayers(players);
        tabRounds.getModel().refresh();
        tabPlayers.getModel().refresh();
        fiveCrowns.pageGameController.refreshScreenTotals(players);
        fiveCrowns.pageGameController.refreshPlayerNames(players);
        fiveCrowns.pageGameController.highlightDealer(fiveCrowns.model.getModel());
        fiveCrowns.pageGameController.highlightRound(fiveCrowns.model.getModel());
        fiveCrowns.pageGameController.handleRound();
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
            const playerCnt = element.getValue();
            fiveCrowns.model.setPlayerCount(playerCnt);
            const players = fiveCrowns.model.getPlayerCount();
            element.setValue(players);
            hideKeyboard(element.getId() + "-inner");
        },


        onPlayButton: function (oApp) {
            fiveCrowns.model.clearScores();
            fiveCrowns.model.setPlayerCount(sap.ui.getCore().byId("playerCount").getValue());   // Get player count from screen
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
            if (!this.oAboutDialog) {
                this.oAboutDialog = new sap.m.Dialog({
                    title: "About Five Crowns",
                    content: new sap.m.VBox({
                        items: [
                            new sap.m.Text({ text: "- Version: 1.00.00 (First release)" }),
                            new sap.m.Text({ text: "- Developed by: Murray Wheeler" })
                        ]
                    }).addStyleClass("sapUiContentPadding"),
                    endButton: new sap.m.Button({ text: "Close", press: () => this.oAboutDialog.close() })
                });
            }
            this.oAboutDialog.open();
        },

        onInstr: function (oApp) {
            requestFullScreen();
            sap.ui.getCore().byId("popoverMain").close()
            oApp.to("pageInstr", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onBack: function (oApp) {
            window.close();
        },


    };

}());
