"use-strict";


fiveCrowns.pageGamesController = (function () {


    return {

        onGamesBack: function (oApp) {
            oApp.back();
        },


        onGameDelete: function (oEvent) {
            // oGame = oEvent.getSource().getBindingContext().getObject();
            gameId = oEvent.getSource().getBindingContext().getObject("gameId");
            gameName = oEvent.getSource().getBindingContext().getObject("gameName");

            // Create confirmation dialog
            var oDialog = new sap.m.Dialog({
                title: "Confirm Deletion",
                type: "Message",
                content: new sap.m.Text({ text: "Are you sure you want to delete the game:\n" + gameName + "?" }),
                beginButton: new sap.m.Button({
                    text: "Yes",
                    press: function () {
                        // Delete game from model
                        fiveCrowns.games.deleteGameById(gameId);
                        fiveCrowns.games.saveGames();
                        // Delete game from screen table (we may be displaying a subset of games)
                        aGames = tabGames.getModel().getData().game;
                        for (let gameNum = 0; gameNum < aGames.length; gameNum++) {
                            if (aGames[gameNum].gameId == gameId) {
                                aGames.splice(gameNum, 1);
                            }
                        }
                        tabGames.getModel().refresh();
                        sap.m.MessageToast.show("Game deleted");
                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "No",
                    press: function () {
                        sap.m.MessageToast.show("Game not deleted");
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy(); // Clean up dialog after it's closed
                }
            });

            // Open the dialog
            oDialog.open();
        },


        onNamePress: function (oGameName) {
            var oContext = oGameName.getBindingContext();
            var oGame = oContext.getObject();
            fiveCrowns.pageGameController.setGameEditable(false);
            fiveCrowns.model.setModelValues(oGame);
            fiveCrowns.pageMainController.gotoGame(oApp);
        },


    };

}());
