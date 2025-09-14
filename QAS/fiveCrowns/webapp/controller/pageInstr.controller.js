"use-strict";


fiveCrowns.pageInstrController = (function() {


    return {

        onBeforeShow: function() {
            // Use jQuery to fetch the HTML content
            jQuery.ajax({
                url: "resources/FiveCrowns.html",
                dataType: "html",
                success: function(data) {
                    sap.ui.getCore().byId("htmlInstructions").setContent(data);
                }
            });
        },

        onBack: function (oApp) {
            oApp.back();
        },


    };

}());
