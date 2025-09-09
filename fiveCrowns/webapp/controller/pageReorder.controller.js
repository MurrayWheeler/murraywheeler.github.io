"use-strict";


fiveCrowns.pageReorderController = (function () {


    return {

        onReorderChange: function (element) {
            var playerPosition = element.getValue();
            var elementId = element.getId();
            var rowNum = elementId.split('-')[2];
            fiveCrowns.model.updatePlayerPosition(rowNum, playerPosition);
            fiveCrowns.pageGameController.setReorderTable();
            fiveCrowns.pageGameController.refreshPlayerNames(fiveCrowns.model.getPlayerCount());
            tabRounds.getModel().refresh();
            tabPlayers.getModel().refresh();
            fiveCrowns.pageGameController.refreshScreenTotals(fiveCrowns.model.getPlayerCount());
        },

        onPlayerUp: function (pressedButton) {
            var playerIndex = pressedButton.getBindingContext().getProperty().playerPosition - 1;
            if (playerIndex <= 0) return;  // Player at top of list. Can't move up
            fiveCrowns.model.updatePlayerPosition(playerIndex, playerIndex);
            fiveCrowns.pageGameController.setReorderTable();
            fiveCrowns.pageGameController.refreshPlayerNames(fiveCrowns.model.getPlayerCount());
            tabRounds.getModel().refresh();
            tabPlayers.getModel().refresh();
            fiveCrowns.pageGameController.refreshScreenTotals(fiveCrowns.model.getPlayerCount());
        },


        onPlayerDown: function (pressedButton) {
            var playerIndex = pressedButton.getBindingContext().getProperty().playerPosition - 1;
            var aPlayers = fiveCrowns.model.getReorderModel().players;
            if (playerIndex >= aPlayers.length - 1) return;  // Player at end of list. Can't move down
            fiveCrowns.model.updatePlayerPosition(playerIndex, playerIndex + 2);
            fiveCrowns.pageGameController.setReorderTable();
            fiveCrowns.pageGameController.refreshPlayerNames(fiveCrowns.model.getPlayerCount());
            tabRounds.getModel().refresh();
            tabPlayers.getModel().refresh();
            fiveCrowns.pageGameController.refreshScreenTotals(fiveCrowns.model.getPlayerCount());
        },


        onDragAndDrop: function (rowFrom, rowTo) {
            if (rowFrom == rowTo) return;
            // A "+" in front of "rowTo" converts the field from a string to a number
            fiveCrowns.model.updatePlayerPosition(rowFrom, +rowTo + 1);
            fiveCrowns.pageGameController.setReorderTable();
            fiveCrowns.pageGameController.refreshPlayerNames(fiveCrowns.model.getPlayerCount());
            tabRounds.getModel().refresh();
            tabPlayers.getModel().refresh();
            fiveCrowns.pageGameController.refreshScreenTotals(fiveCrowns.model.getPlayerCount());
        },


        onReorderBack: function (oApp) {
            oApp.back();
        },


    };

}());
