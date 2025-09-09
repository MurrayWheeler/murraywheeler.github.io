"use-strict";


fiveCrowns.settings = (function () {

    const settingsLocalStorage = "fiveCrowns.settingsData";
    var oSettings = new settingsClass;

    // Constructor function for Settings object
    function settingsClass() {

        // Properties
        // ====================================================
        this.playerPrefix = "P";
        this.defaultPlayerCount = 3;
        this.screenTimeout = 300;
        // this.pageTransition = "slide";
        this.pageTransition = "baseSlide";
        // this.pageTransition = "fade";
        // this.pageTransition = "flip";
        // this.pageTransition = "show";


        // Methods
        // ====================================================

        this.getPlayerPrefix = function () {
            return this.playerPrefix;
        }

        this.setPlayerPrefix = function (playerPrefix) {
            this.playerPrefix = playerPrefix;
        }


        this.getScreenTimeout = function () {
            return this.screenTimeout;
        }

        this.setScreenTimeout = function (screenTimeout) {
            this.screenTimeout = screenTimeout;
        }

        this.getPageTransition = function () {
            return this.pageTransition;
        }


    };


    // Private Static Methods
    // ====================================================

    function saveSettings(oSettings) {
        // Storing data:
        var settingsJson = JSON.stringify(oSettings);
        localStorage.setItem(settingsLocalStorage, settingsJson);
    };

    function loadSettings(oSettings) {
        // Retrieving data:
        let settingsJson = localStorage.getItem(settingsLocalStorage);
        if (!settingsJson) return;
        let oSettingsValues = JSON.parse(settingsJson);
        // for (var propertyName in oSettingsValues) {
        //     oSettings[propertyName] = oSettingsValues[propertyName];
        // }
        // Key words for searching "assign" "reference" "symbol"
        for (const propertyName of Object.keys(oSettingsValues)) {
            if (propertyName in oSettings) {
                oSettings[propertyName] = oSettingsValues[propertyName];
            }
        }
    };



    // Public Static Methods
    // ====================================================

    return {

        initSettings: function () {
            // localStorage.removeItem(settingsLocalStorage)
            // localStorage.clear();
            loadSettings(fiveCrowns.settings.oSettings);
        },

        oSettings: oSettings,
        saveSettings: saveSettings,


    };

}());

