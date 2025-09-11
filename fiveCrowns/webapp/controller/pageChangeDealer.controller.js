"use-strict";


fiveCrowns.pageChangeDealerController = (function () {


    function setDealer(playerNum) {
        oGame = fiveCrowns.model.getModel();
        initialDealer = playerNum - (oGame.currentRound % oGame.playerCount);  // MOD function
        if (initialDealer < 0) {
            initialDealer = initialDealer + oGame.playerCount;
        }
        oGame.setInitialDealer(initialDealer);
        oGame.setCurrentDealer(playerNum);
        fiveCrowns.pageGameController.highlightDealer(oGame);
        fiveCrowns.pageGameController.highlightRound(oGame);
    };



    return {

        onChangeDealerBack: function (oApp) {
            oChangeDealer = fiveCrowns.model.getChangeDealerModel();
            let playerCount = fiveCrowns.model.getModel().playerCount;
            for (let playerNum = 0; playerNum < playerCount; playerNum++) {
                if (oChangeDealer.players[playerNum].selected) {
                    setDealer(playerNum);
                    break;
                }
            }
            oApp.back();
        },

        onChangeDealerRB: function (oApp) {
            // We seem to get here twice for the radio button select. The first time there are 2 selected, the second time only 1 selected.
            // So we just ignore the first time.
            let selectedCount = 0;
            oChangeDealer = fiveCrowns.model.getChangeDealerModel();
            let playerCount = fiveCrowns.model.getModel().playerCount;
            for (let playerNum = 0; playerNum < playerCount; playerNum++) {
                if (oChangeDealer.players[playerNum].selected) {
                    selectedCount++;
                }
            }
            if (selectedCount > 1) {
                return;
            }
            for (let playerNum = 0; playerNum < playerCount; playerNum++) {
                if (oChangeDealer.players[playerNum].selected) {
                    setDealer(playerNum);
                    break;
                }
            }
            oApp.back();
        },

        onChangeDealerSelect: function (element) {
            // Look for selected player name using id of selected player name
            let thisId = element.sId;
            let playerCount = fiveCrowns.model.getModel().playerCount;
            for (let rowNum = 0; rowNum < playerCount; rowNum++) {
                let rowId = tabChangeDealer.getItems()[rowNum].getCells()[1].getId();
                if (rowId === thisId) {
                    setDealer(rowNum);
                    break;
                }
            }
            oApp.back();
        },

        setDealer: setDealer,

    };

}());
