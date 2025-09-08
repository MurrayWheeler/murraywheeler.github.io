"use-strict";


fiveCrowns.pageGamesView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageGames", { title: "Games page" });


      // Add image etc to Header toolbar
      var barGamesHeader = new sap.m.Toolbar({ id: "idBarGamesHeader" });
      barGamesHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barGamesHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barGamesHeader.addContent(new sap.m.ToolbarSpacer());
      barGamesHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageGamesController.onGamesBack(oApp); } }));
      page.setCustomHeader(barGamesHeader);



      // Table layout
      // tabGames = new sap.m.Table({ id: "idGamesTable", mode: "MultiSelect", includeItemInSelection: true });
      tabGames = new sap.m.Table({ id: "idGamesTable", sticky: ["ColumnHeaders", "HeaderToolbar", "InfoToolbar"] });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.games.getModel());
      tabGames.setModel(oModel);

      // Row press event no longer wanted. Code left for reference
      // tabGames.attachSelectionChange(function (oEvent) { fiveCrowns.pageGamesController.onRowPress(oEvent); });

      // Add columns
      // tabGames.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Bin" }) }));
      // tabGames.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Game" }) }));
      tabGames.addColumn(new sap.m.Column({}));  // No header defined for column
      tabGames.addColumn(new sap.m.Column({}));  // No header defined for column
      tabGames.getColumns()[0].setWidth("15%");

      // Add cells
      colListItem = new sap.m.ColumnListItem({});
      // colListItem.addCell(new sap.m.Text({ id: "gameId", text: "{gameId}" }));
      colListItem.addCell(new sap.m.Button({ id: "gameDelete", icon: "sap-icon://delete", press: function (oEvent) { fiveCrowns.pageGamesController.onGameDelete(oEvent); }}));
      colListItem.addCell(new sap.m.Button({ id: "gameName", text: "{gameName}", type: "Transparent", press: function () { fiveCrowns.pageGamesController.onNamePress(this); } }));

      tabGames.bindAggregation("items", "/game", colListItem);
      page.addContent(tabGames);




      // Add page to app
      oApp.addPage(page);

      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");

      tabGames.addStyleClass("myTableBackground");
      tabGames.addStyleClass("myButtonFontColor");
      tabGames.addStyleClass("myButtonFontSize");
      tabGames.addStyleClass("myTableInputMargins");


      playButton.addStyleClass("myButtonFontSize");

    },


  };

}());

