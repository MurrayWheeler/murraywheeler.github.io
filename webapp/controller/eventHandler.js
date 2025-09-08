"use-strict";


fiveCrowns.eventHandler = (function () {

    function unUsed() {
        // Unhighlight all rounds
    };



    return {

        registerEvents: function () {
            sap.ui.Device.orientation.attachHandler(function (oEvent) {
                fiveCrowns.eventHandler.onOrientationChange(oEvent);
            })
        },

        onOrientationChange: function (oEvent) {
            var pageId = fiveCrowns.model.getApp().getCurrentPage().getId();
            if (pageId == "pageGame") {
                if (sap.ui.Device.orientation.landscape) {
                    // oApp.back();
                    oApp.to("pageGameLandscape", fiveCrowns.settings.oSettings.getPageTransition());
                    oApp.removePage("pageGame");
                    oApp.addPage(sap.ui.getCore().byId("pageGame"))
                    tabPlayers.getModel().refresh();
                };
            };
            if (pageId == "pageGameLandscape") {
                if (sap.ui.Device.orientation.portrait) {
                    // oApp.back();
                    oApp.to("pageGame", fiveCrowns.settings.oSettings.getPageTransition());
                    oApp.removePage("pageGameLandscape");
                    oApp.addPage(sap.ui.getCore().byId("pageGameLandscape"))
                    tabRounds.getModel().refresh();
                };
            };
        },


    };

}());
