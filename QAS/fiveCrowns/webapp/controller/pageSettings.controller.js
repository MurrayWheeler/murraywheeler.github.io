"use-strict";


fiveCrowns.pageSettingsController = (function () {


    return {

        onSettingsBack: function (oApp) {
            // Save settings here for now. I may move this later. Eg. After each change, or after confirmation popup
            fiveCrowns.settings.saveSettings(fiveCrowns.settings.oSettings);
            oApp.back();
        },


        onLandscapePrefix: function (element) {
            for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
                column = roundNum + 1; // Offset to step over "Player" column
                roundName = fiveCrowns.model.getRoundNameL(roundNum);
                tabPlayers.getColumns()[column].getHeader().setText(roundName);
            }
            hideKeyboard(element.getId() + "-inner");
        },


        onTimeout: function (element) {
            hideKeyboard(element.getId() + "-inner");
        },




    };

}());
