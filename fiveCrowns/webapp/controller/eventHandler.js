"use-strict";


fiveCrowns.eventHandler = (function() {
    var touchStartX = 0,
        touchstartY = 0,
        touchendX = 0,
        touchendY = 0;
    var swipeThreshold = 50; // Minimum distance for a swipe

    return {

        registerEvents: function() {
            sap.ui.Device.orientation.attachHandler(function(oEvent) {
                fiveCrowns.eventHandler.onOrientationChange(oEvent);
            });

            // Catch Android back button (browser back)
            window.addEventListener('popstate', fiveCrowns.eventHandler.onBrowserBack);
            history.pushState(null, ''); // Push an initial state to the history

            // Listen for touch start to record the initial position
            document.addEventListener('touchstart', function(event) {
                // Only track single-finger touches
                if (event.touches.length === 1) {
                    touchStartX = event.touches[0].clientX;
                    touchstartY = event.touches[0].clientY; // For pull-to-refresh prevention
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
                    touchendX = event.changedTouches[0].clientX;
                    touchendY = event.changedTouches[0].clientY;

                    // Check if it was a downward swipe from the top
                    if (window.scrollY === 0 && touchendY > touchstartY + swipeThreshold) {
                        var currentPageId = fiveCrowns.model.getApp().getCurrentPage().getId();
                        if (currentPageId === "pageGame" || currentPageId === "pageGameLandscape") {
                            // Create confirmation dialog for new game
                            var oDialog = new sap.m.Dialog({
                                title: "New Game",
                                type: "Message",
                                content: new sap.m.Text({ text: "Are you sure you want to start a new game?" }),
                                beginButton: new sap.m.Button({
                                    text: "Yes",
                                    press: function () {
                                        fiveCrowns.pageGameController.onNewGame();
                                        oDialog.close();
                                    }
                                }),
                                endButton: new sap.m.Button({
                                    text: "No",
                                    press: function () {
                                        oDialog.close();
                                    }
                                }),
                                afterClose: function () { oDialog.destroy(); }
                            }).open();
                        }
                    }

                    var deltaX = touchendX - touchStartX;
                    var deltaY = touchendY - touchstartY;
                    var currentPageId = fiveCrowns.model.getApp().getCurrentPage().getId();

                    // Check for swipe left on main page
                    if (currentPageId === "pageMain") {
                        // Check for a left swipe that is more horizontal than vertical
                        if (deltaX < -swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                            fiveCrowns.pageMainController.onResumeGame(oApp);
                        }
                    } else {
                        // Check for swipe right on any other page to go back
                        if (deltaX > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                            switch (currentPageId) {
                                case "pageGame":
                                case "pageGameLandscape":
                                    fiveCrowns.pageGameController.onBack(oApp);
                                    break;
                                case "pageGames":
                                    fiveCrowns.pageGamesController.onGamesBack(oApp);
                                    break;
                                case "pageReorder":
                                    fiveCrowns.pageReorderController.onReorderBack(oApp);
                                    break;
                                case "pageChangeDealer":
                                    fiveCrowns.pageChangeDealerController.onChangeDealerBack(oApp);
                                    break;
                                case "pageSettings":
                                    fiveCrowns.pageSettingsController.onSettingsBack(oApp);
                                    break;
                                case "pageStatistics":
                                case "pageInstr":
                                    oApp.back(); // These pages have a simple back navigation
                                    break;
                            }
                        }
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

        onBrowserBack: function(event) {
            // Prevent the default back behavior
            event.preventDefault();

            // Push a new state to "catch" the next back button press
            history.pushState(null, '');

            var currentPageId = fiveCrowns.model.getApp().getCurrentPage().getId();

            // Don't go back if on the main page, as there's nowhere to go.
            if (currentPageId === "pageMain") {
                // You could show a toast message asking if the user wants to exit.
                // For now, we'll just do nothing.
                return;
            }

            // Use the existing back handlers for each page
            switch (currentPageId) {
                case "pageGame":
                case "pageGameLandscape":
                    fiveCrowns.pageGameController.onBack(oApp);
                    break;
                case "pageGames":
                    fiveCrowns.pageGamesController.onGamesBack(oApp);
                    break;
                case "pageReorder":
                    fiveCrowns.pageReorderController.onReorderBack(oApp);
                    break;
                case "pageChangeDealer":
                    fiveCrowns.pageChangeDealerController.onChangeDealerBack(oApp);
                    break;
                case "pageSettings":
                    fiveCrowns.pageSettingsController.onSettingsBack(oApp);
                    break;
                default: // For pages like Statistics, Instructions
                    oApp.back();
                    break;
            }
        },

    };

}());
