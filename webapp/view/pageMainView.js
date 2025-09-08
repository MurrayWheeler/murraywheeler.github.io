"use-strict";


fiveCrowns.pageMainView = (function () {

  return {

    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageMain", { title: "Five Crowns" });


      // Use popover (instead of sap.m.Menu), so it does not go to small screen on a mobile
      // var menuButtonNew = new sap.m.Button({ type: "Transparent", icon: "sap-icon://media-play", text: "New game", press: function () { fiveCrowns.pageMainController.onNewGame(oApp); } });
      // var menuButtonResume = new sap.m.Button({ type: "Transparent", icon: "sap-icon://restart", text: "Resume game", press: function () { fiveCrowns.pageMainController.onResumeGame(oApp); } });
      var menuButtonSettings = new sap.m.Button({ type: "Transparent", icon: "sap-icon://action-settings", text: "Settings", press: function () { fiveCrowns.pageMainController.onSettings(oApp); } });
      var menuButtonStatistics = new sap.m.Button({ type: "Transparent", icon: "sap-icon://database", text: "Statistics", press: function () { fiveCrowns.pageMainController.onStatistics(oApp); } });
      var menuButtonHelp = new sap.m.Button({ type: "Transparent", icon: "sap-icon://sys-help", text: "Help", press: function () { fiveCrowns.pageMainController.onHelp(oApp); } });
      var menuButtonInstr = new sap.m.Button({ type: "Transparent", icon: "sap-icon://learning-assistant", text: "Instructions", press: function () { fiveCrowns.pageMainController.onInstr(oApp); } });
      var menuButtonAbout = new sap.m.Button({ type: "Transparent", icon: "sap-icon://hint", text: "About", press: function () { fiveCrowns.pageMainController.onAbout(oApp); } });
      var vboxMenu = new sap.m.VBox({ items: [menuButtonSettings, menuButtonStatistics, menuButtonInstr, menuButtonAbout] });
      var popoverMain = new sap.m.Popover({ id:"popoverMain", title: "Options", placement: sap.m.PlacementType.Bottom, content: [vboxMenu] });
      var menuButtonMain = new sap.m.Button({ icon: "sap-icon://menu2", press: function (oEvent) { popoverMain.openBy(menuButtonMain); } });

      // Add Header bar
      var barMainHeader = new sap.m.Toolbar({ id: "idBarMainHeader" });
      barMainHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barMainHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barMainHeader.addContent(new sap.m.ToolbarSpacer());
      barMainHeader.addContent(menuButtonMain);
      barMainHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageMainController.onBack(oApp); } }));
      page.setCustomHeader(barMainHeader);



      // Add content
      page.addContent(new sap.m.Text({ text: "" }));  // Blank line

      vBox = new sap.m.VBox({ alignItems: "Center", justifyContent: "SpaceAround" });
      page.addContent(vBox);

      vBox.addItem(new sap.m.Text({ text: "" }));
      vBox.addItem(new sap.m.Text({ text: "" }));
      hBox = new sap.m.HBox({ alignItems: "Center", justifyContent: "SpaceAround" });
      vBox.addItem(hBox);

      playersLabel = new sap.m.Label({ text: "Players" });
      hBox.addItem(playersLabel);
      hBox.addItem(new sap.m.ToolbarSpacer({ width: "10px" }));
      playerCount = new sap.m.Input({ id: "playerCount", placeholder: "Number of players", type: "Number", width: "80px", change: function () { fiveCrowns.pageMainController.onPlayerCount(this) } });
      let iPlayerCount = fiveCrowns.model.getPlayerCount();
      if (iPlayerCount) {
        playerCount.setValue(iPlayerCount);    // If we have a previously set player count, then use it
      } else {
        playerCount.setValue(fiveCrowns.settings.oSettings.defaultPlayerCount);   // Else use the default player count. This should only happen once, on the first ever game.
      }
      hBox.addItem(playerCount);
      hBox.addItem(new sap.m.ToolbarSpacer({ width: "30px" }));
      playButton = new sap.m.Button({ text: "Play now >" });
      playButton.attachPress(function () { fiveCrowns.pageMainController.onPlayButton(oApp) });
      hBox.addItem(playButton);

      vBox.addItem(new sap.m.Text({ text: "" }));
      vBox.addItem(new sap.m.Text({ text: "" }));
      vBox.addItem(new sap.m.Text({ text: "" }));
      resumeButton = new sap.m.Button({ text: "Resume Game", press: function () { fiveCrowns.pageMainController.onResumeGame(oApp) } });
      vBox.addItem(resumeButton);

      vBox.addItem(new sap.m.Text({ text: "" }));
      listButton = new sap.m.Button({ text: "List Games", press: function () { fiveCrowns.pageMainController.onListGames(oApp) } });
      vBox.addItem(listButton);


      // Add page to app
      oApp.addPage(page);

      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");
      playersLabel.addStyleClass("myLabelFontColor");
      playersLabel.addStyleClass("myLabelFontSize");
      playerCount.addStyleClass("myInputFontSize");
      playButton.addStyleClass("myButtonFontSize");
      resumeButton.addStyleClass("myButtonFontSize");
      listButton.addStyleClass("myButtonFontSize");

      // menuMain.addStyleClass("myCustomBackground");
      popoverMain.addStyleClass("myMenuStyle");

    },


  };

}());

