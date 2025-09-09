"use-strict";


fiveCrowns.pageGameView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      var page = new sap.m.Page("pageGame", { title: "Game page" });


      // Use popover, so it does not go to small screen on a mobile
      var menuButtonReorder = new sap.m.Button({ type: "Transparent", icon: "sap-icon://citizen-connect", text: "Reorder players", press: function () { fiveCrowns.pageGameController.onReorderPlayers(oApp); } });
      var menuButtonDealer = new sap.m.Button({ type: "Transparent", icon: "sap-icon://people-connected", text: "Change dealer", press: function () { fiveCrowns.pageGameController.onDealerChange(oApp); } });
      var menuButtonNew = new sap.m.Button({ type: "Transparent", icon: "sap-icon://media-play", text: "New Game", press: function () { fiveCrowns.pageGameController.onNewGame(); } });
      var menuResume = new sap.m.Button({ type: "Transparent", icon: "sap-icon://media-play", text: "Resume game", press: function () { fiveCrowns.pageGameController.onResume(); } });
      var menuButtonClear = new sap.m.Button({ type: "Transparent", icon: "sap-icon://clear-all", text: "Clear scores", press: function () { fiveCrowns.pageGameController.onClearScores(); } });
      var vboxMenu = new sap.m.VBox({ items: [menuButtonReorder, menuButtonDealer, menuButtonNew, menuResume] });
      var popoverGame = new sap.m.Popover({ id:"popoverGame", title: "Options", placement: sap.m.PlacementType.Bottom, content: [vboxMenu] });
      var menuButton = new sap.m.Button({ icon: "sap-icon://menu2", press: function (oEvent) { popoverGame.openBy(menuButton); } });


      // Add menu etc to Header toolbar
      var barGameHeader = new sap.m.Toolbar({ id: "idBarGameHeader" });
      barGameHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barGameHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barGameHeader.addContent(new sap.m.ToolbarSpacer());
      barGameHeader.addContent(menuButton);
      barGameHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageGameController.onBack(oApp); } }));
      page.setCustomHeader(barGameHeader);




      // Table layout
      tabRounds = new sap.m.Table({ id: "idGameTable", sticky: ["ColumnHeaders", "HeaderToolbar", "InfoToolbar"] });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.model.getModel());
      tabRounds.setModel(oModel);

      // Add columns
      tabRounds.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: " " }) }));  // Column for "Rounds"
      players = fiveCrowns.model.getModel().players;      // Add players as columns
      for (let playerNum = 0; playerNum < fiveCrowns.model.getMaxPlayers(); playerNum++) {
        playerName = players[playerNum].playerName;
        playerHeaderId = 'playerName-' + playerNum;
        placeHolder = fiveCrowns.model.getDefaultPlayerName(playerNum);
        tabRounds.addColumn(new sap.m.Column(
          {
            header: new sap.m.Input({
              id: playerHeaderId,
              value: playerName,
              placeholder: placeHolder,
              change: function () { fiveCrowns.pageGameController.onPlayerChange(this) }
            })
          }
        ));
      }

      // Add cells
      colListItem = new sap.m.ColumnListItem({});
      colListItem.addCell(new sap.m.Text({ id: "roundId", text: "{round}", wrapping: false }));
      let maxPlayers = fiveCrowns.model.getMaxPlayers();
      for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
        let columnId = "s-" + playerNum;
        let columnValue = "{s" + playerNum + "}";
        colListItem.addCell(new sap.m.Input({ id: columnId, value: columnValue, type: "Number", change: function () { fiveCrowns.pageGameController.onScoreChange(this) } }));
      };

      // Bind table and add to page
      tabRounds.bindAggregation("items", "/rounds", colListItem);
      page.addContent(tabRounds);



      
      // Page Add footer
      barTotal = new sap.m.Toolbar({ id: "idBarTotal" });
      barTotal.addContent(new sap.m.Input({ value: "Total", editable: false }));
      for (let playerNum = 0; playerNum < maxPlayers; playerNum++) {
        let totalId = "total" + playerNum;
        barTotal.addContent(new sap.m.Input({ id: totalId, textAlign: sap.ui.core.TextAlign.Center, type: "Number", editable: false }));
      };


      page.setFooter(barTotal);
      // page.setFloatingFooter(true);


      // Add page to app
      oApp.addPage(page);



      // Detect long press on the header. Use to change dealer
      // This doesn't work as the phone selects text on a long press. Left here in the design changes, and it is needed
      var pressTimer;
      // Attach the touchstart event to detect the long press
      tabRounds.attachBrowserEvent("touchstart", function (oEvent) {
        var target = oEvent.target;
        // Start the timer for long press detection
        pressTimer = setTimeout(function () {
          // Check if the target is part of the header row
          if (target.closest("th")) {
            var headerCell = target.closest("th"); // Get the <th> element
            var columnIndex = Array.from(headerCell.parentElement.children).indexOf(headerCell);
            // columnIndex starts from 1 (not zero). Ignore a long press on the first column, it is not a player
            if (columnIndex >= 2) {
              var playerNum = columnIndex - 2;
              fiveCrowns.pageChangeDealerController.setDealer(playerNum);
            }
          }
        }, 1500); // Long press duration in milliseconds
      });
      // Attach the touchend and touchcancel events to cancel the timer
      tabRounds.attachBrowserEvent("touchend", function () {
        clearTimeout(pressTimer);
      });
      tabRounds.attachBrowserEvent("touchcancel", function () {
        clearTimeout(pressTimer);
      });


      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");

      tabRounds.addStyleClass("myTableBackground");
      tabRounds.addStyleClass("myTableFontColor");
      tabRounds.addStyleClass("myTableFontSize");
      tabRounds.addStyleClass("myTableInputMargins");
      tabRounds.addStyleClass("myTruncateStyle");

      barTotal.addStyleClass("myToolbarFontSize");
      barTotal.addStyleClass("myTableInputMargins");


    },



  };

}());
