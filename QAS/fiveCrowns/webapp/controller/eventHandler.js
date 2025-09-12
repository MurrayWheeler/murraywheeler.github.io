"use-strict";


fiveCrowns.eventHandler = (function() {
    var touchstartY = 0;
    var touchendY = 0;
    var swipeThreshold = 50; // Minimum distance for a swipe

    return {

        registerEvents: function() {
            sap.ui.Device.orientation.attachHandler(function(oEvent) {
                fiveCrowns.eventHandler.onOrientationChange(oEvent);
            });

            // Listen for touch start to record the initial position
            document.addEventListener('touchstart', function(event) {
                // Only track single-finger touches
                if (event.touches.length === 1) {
                    touchstartY = event.touches[0].clientY;
                }
            }, { passive: false });

            // Listen for touch move to prevent default pull-to-refresh
            document.addEventListener('touchmove', function(event) {
                // Check if we are at the top of the page
                if (window.scrollY === 0) {
                    var touch = event.touches[0];
                    // If the user is swiping down
                    if (touch.clientY > touchstartY) {
                        // This is a pull-down gesture at the top, prevent it.
                        event.preventDefault();
                    }
                }
            }, { passive: false }); // 'passive: false' is crucial to allow preventDefault()

            // Optional: Listen for touchend to perform a custom action
            document.addEventListener('touchend', function(event) {
                if (event.changedTouches.length === 1) {
                    touchendY = event.changedTouches[0].clientY;
                    // Check if it was a downward swipe from the top
                    if (window.scrollY === 0 && touchendY > touchstartY + swipeThreshold) {
                        console.log("Swipe down detected!");
                        // You can trigger a custom action here, like a manual refresh.
                        // For example: sap.m.MessageToast.show("Refresh action triggered!");
                    }
                }
            }, { passive: false });
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
