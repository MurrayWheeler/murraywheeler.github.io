"use-strict";


fiveCrowns.pageSettingsController = (function () {


    return {

        onSettingsBack: function (oApp) {
            // Save settings here for now. I may move this later. Eg. After each change, or after confirmation popup
            fiveCrowns.settings.saveSettings(fiveCrowns.settings.oSettings);
            oApp.back();
        },


        onTimeout: function (element) {
            hideKeyboard(element.getId() + "-inner");
        },




    };

}());
