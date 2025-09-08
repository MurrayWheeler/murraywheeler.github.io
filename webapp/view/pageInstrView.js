"use-strict";


fiveCrowns.pageInstrView = (function () {

  return {

    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageInstr", { title: "Five Crowns" });


      // Add Header bar
      var barInstrHeader = new sap.m.Toolbar({ id: "idBarInstrHeader" });
      barInstrHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barInstrHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barInstrHeader.addContent(new sap.m.ToolbarSpacer());
      barInstrHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageInstrController.onBack(oApp); } }));
      page.setCustomHeader(barInstrHeader);

      // Add instructions from HTML file
      var oHtml = new sap.ui.core.HTML({ content: '<iframe src="resources/FiveCrowns.html" width="100%" height="100%" style="border:none;"></iframe>' });
      page.addContent(oHtml);


      // Add page to app
      oApp.addPage(page);

      // // Load custom CSS
      // jQuery.sap.includeStyleSheet("css/style.css");
      // page.addStyleClass("myCustomBackground");

    },


  };

}());

