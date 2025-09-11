"use-strict";


fiveCrowns.pageGameLandscapeView = (function () {

  return {

    layout: function (oApp) {

      var page = new sap.m.Page("pageGameLandscape", { title: "Game page" });
      // var page = new sap.m.Page("pageGameLandscape", { showHeader: false });

      // // Add Menu button
      // var menuItemClear = new sap.m.MenuItem({ icon: "sap-icon://clear-all", text: "Clear scores", press: function () { fiveCrowns.pageGameController.onClearScores(); } });
      // var menuItemReorder = new sap.m.MenuItem({ icon: "sap-icon://citizen-connect", text: "Reorder players", press: function () { fiveCrowns.pageGameController.onReorderPlayers(oApp); } });
      // var menuItemDealer = new sap.m.MenuItem({ icon: "sap-icon://people-connected", text: "Change dealer", press: function () { fiveCrowns.pageGameController.onDealerChange(oApp); } });
      // var menuItemBack = new sap.m.MenuItem({ icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageGameController.onBack(oApp); } });
      // // var menuItemRefresh = new sap.m.MenuItem({ icon: "sap-icon://refresh", text: "Refresh", press: function () { fiveCrowns.pageGameController.onGameRefresh(); } });
      // var menuGameL = new sap.m.Menu({ items: [menuItemReorder, menuItemDealer, menuItemClear] });
      // var menuButton = new sap.m.MenuButton({ icon: "sap-icon://menu2", menu: menuGameL });

      // Use popover, so it does not go to full screen on a mobile
      var menuButtonReorder = new sap.m.Button({ type: "Transparent", icon: "sap-icon://citizen-connect", text: "Reorder players", press: function () { fiveCrowns.pageGameController.onReorderPlayers(oApp); } });
      var menuButtonDealer = new sap.m.Button({ type: "Transparent", icon: "sap-icon://people-connected", text: "Change dealer", press: function () { fiveCrowns.pageGameController.onDealerChange(oApp); } });
      var menuButtonNew = new sap.m.Button({ type: "Transparent", icon: "sap-icon://media-play", text: "New Game", press: function () { fiveCrowns.pageGameController.onNewGame(); } });
      var menuResume = new sap.m.Button({ type: "Transparent", icon: "sap-icon://media-play", text: "Resume game", press: function () { fiveCrowns.pageGameController.onResume(); } });
      var menuButtonClear = new sap.m.Button({ type: "Transparent", icon: "sap-icon://clear-all", text: "Clear scores", press: function () { fiveCrowns.pageGameController.onClearScores(); } });
      var menuButtonBack = new sap.m.Button({ type: "Transparent", icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageGameController.onBack(oApp); } });
      // var vboxMenu = new sap.m.VBox({ items: [menuButtonReorder, menuButtonDealer, menuButtonNew, menuResume, menuButtonBack] });
      var vboxMenu = new sap.m.VBox({ items: [menuButtonReorder, menuButtonDealer, menuButtonNew, menuResume] });
      var popoverGameL = new sap.m.Popover({ id: "popoverGameL", title: "Options", placement: sap.m.PlacementType.Bottom, content: [vboxMenu] });
      var menuButton = new sap.m.Button({ icon: "sap-icon://menu2", press: function (oEvent) { popoverGameL.openBy(menuButton); } });


      // Add Header bar
      var barGameLHeader = new sap.m.Toolbar({ id: "idBarGameLHeader" });
      barGameLHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barGameLHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barGameLHeader.addContent(new sap.m.ToolbarSpacer());
      barGameLHeader.addContent(menuButton);
      barGameLHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageGameController.onBack(oApp); } }));
      page.setCustomHeader(barGameLHeader);

      // Table layout
      tabPlayers = new sap.m.Table({ id: "idGameLTable", sticky: ["ColumnHeaders", "HeaderToolbar", "InfoToolbar"] });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.model.getModel());
      tabPlayers.setModel(oModel);
      // Add columns
      tabPlayers.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "" }) }));
      // tabPlayers.addColumn(new sap.m.Column({ header: menuButton }));
      tabPlayers.getColumns()[0].setWidth("15%");
      rounds = fiveCrowns.model.getModel().rounds;
      for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
        roundName = rounds[roundNum].round;
        roundHeaderId = 'roundName-' + roundNum;
        tabPlayers.addColumn(new sap.m.Column({ header: new sap.m.Text({ id: roundHeaderId, text: roundName, wrapping: false }) }));
      }
      tabPlayers.addColumn(new sap.m.Column({ header: new sap.m.Text({ id: "idLTotal", text: "Total" }) }));

      // Add cells
      colListItem = new sap.m.ColumnListItem({});
      colListItem.addCell(new sap.m.Input({ id: "playerId", value: "{playerName}", change: function () { fiveCrowns.pageGameController.onPlayerChange(this) } }));
      // colListItem.addCell(new sap.m.Input({ value: "{s0}", type: "Number", styleClass: "sapUiSizeCompact", change: function(){fiveCrowns.pageGameController.onScoreChange()} }));   
      var maxRounds = fiveCrowns.model.getMaxRounds();
      for (let roundNum = 0; roundNum < maxRounds; roundNum++) {
        var colId = "r-" + roundNum;
        var colVal = "{r" + roundNum + "}";
        colListItem.addCell(new sap.m.Input({ id: colId, value: colVal, type: "Number", change: function () { fiveCrowns.pageGameController.onScoreChange(this) } }));
      }
      colListItem.addCell(new sap.m.Text({ id: "t-0", text: "{t0}" }));


      tabPlayers.bindAggregation("items", "/players", colListItem);
      page.addContent(tabPlayers);


      // Add page to app
      oApp.addPage(page);


      // Detect long press in table
      tabPlayers.addEventDelegate({
        onAfterRendering: function () {
          tabPlayers.$().on("touchstart", "tr", function (oEvent) {
            var pressTimer;
            var $target = $(this); // jQuery object for the row
            var eventTarget = oEvent.target;

            // Start a timer for the long press
            pressTimer = setTimeout(function () {
              var oRow = sap.ui.getCore().byId($target.attr("id"));
              if (oRow && oRow.getBindingContext()) {
                var oData = oRow.getBindingContext().getObject();
                var cell = eventTarget.closest("td, th"); // Find the nearest cell
                var columnIndex = Array.from(cell.parentElement.children).indexOf(cell)
                if (columnIndex == 1) {   // Only long press on column 1, Player Name
                  var playerNum = oData.playerPosition - 1;
                  fiveCrowns.pageChangeDealerController.setDealer(playerNum);
                }
              }
            }, 1500); // milliseconds for long press
            // Cancel the timer on touchend or touchmove
            $target.on("touchend touchmove", function () {
              clearTimeout(pressTimer);
              $target.off("touchend touchmove"); // Prevent multiple bindings
            });
          });
        }
      });



      // Set tabStops each time we go to the Landscape screen
      //   - Can only set if the cell is on the screen. As this is dependent on playerCount, we need to use onAfterShow of page.
      sap.ui.getCore().byId('pageGameLandscape').addEventDelegate({ onAfterShow: function () { fiveCrowns.pageGameController.tabStopSet(); } });



      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");
      tabPlayers.addStyleClass("myTableBackground");
      tabPlayers.addStyleClass("myTableRowHeight");
      tabPlayers.addStyleClass("myTableFontColor");
      tabPlayers.addStyleClass("myTableFontSize");
      tabPlayers.addStyleClass("myTruncateStyle");
      tabPlayers.addStyleClass("myLandscapeHeader");


    },



  };

}());

