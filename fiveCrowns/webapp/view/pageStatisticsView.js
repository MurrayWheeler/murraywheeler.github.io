"use-strict";


fiveCrowns.pageStatisticsView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageStatistics", { title: "Statistics" });

      // Build menu button
      var menuItemBack = new sap.m.MenuItem({ icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageStatisticsController.onStatisticsBack(oApp); } });
      var menuStatistics = new sap.m.Menu({ items: [] });
      var menuButtonStatistics = new sap.m.MenuButton({ icon: "sap-icon://menu2", menu: menuStatistics });

      // Add menu etc to Header toolbar
      var barStatisticsHeader = new sap.m.Toolbar({ id: "idBarStatisticsHeader" });
      barStatisticsHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barStatisticsHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barStatisticsHeader.addContent(new sap.m.ToolbarSpacer());
      // barStatisticsHeader.addContent(menuButtonStatistics);
      barStatisticsHeader.addContent(new sap.m.Button({ icon: "sap-icon://refresh", press: function () { fiveCrowns.pageStatisticsController.onRefresh(oApp); } }));
      barStatisticsHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageStatisticsController.onBack(oApp); } }));
      page.setCustomHeader(barStatisticsHeader);

      
      // Form layout
      frmStatistics = new sap.ui.layout.form.SimpleForm({ id: "idStatistics", title: "Statistics (of saved games)" });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.statistics.oStatistics);
      frmStatistics.setModel(oModel);

      frmStatistics.addContent(new sap.m.Label({ text: "Games played" }));
      frmStatistics.addContent(new sap.m.Button({ text: "{/totalGames}", press: function () { fiveCrowns.pageStatisticsController.onTotalGames(); } }).addStyleClass("myLeftJustifyButton"));
      frmStatistics.addContent(new sap.m.Label({ text: "Incomplete games" }));
      frmStatistics.addContent(new sap.m.Button({ text: "{/incompleteGames}", press: function () { fiveCrowns.pageStatisticsController.onIncompleteGames(); } }).addStyleClass("myLeftJustifyButton"));
      frmStatistics.addContent(new sap.m.Label({ text: "Highest score" }));
      frmStatistics.addContent(new sap.m.Button({ text: "{/highestTotalDescription}", press: function () { fiveCrowns.pageStatisticsController.onHighestScore(); } }).addStyleClass("myLeftJustifyButton"));
      frmStatistics.addContent(new sap.m.Label({ text: "Lowest score" }));
      frmStatistics.addContent(new sap.m.Button({ text: "{/lowestTotalDescription}", press: function () { fiveCrowns.pageStatisticsController.onLowestScore(); } }).addStyleClass("myLeftJustifyButton"));
      frmStatistics.addContent(new sap.m.Label({ text: "Highest hand" }));
      frmStatistics.addContent(new sap.m.Button({ text: "{/highestRoundDescription}", press: function () { fiveCrowns.pageStatisticsController.onHighestRound(); } }).addStyleClass("myLeftJustifyButton"));


      page.addContent(frmStatistics);


      // Add page to app
      oApp.addPage(page);

      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");
      frmStatistics.addStyleClass("myLabelFontColorBlack");

      // Prevent pull-to-refresh on mobile
      page.addEventDelegate({
        onTouchMove: function(oEvent) {
          if (oEvent && oEvent.originalEvent && oEvent.originalEvent.touches && oEvent.originalEvent.touches.length === 1) {
            var touch = oEvent.originalEvent.touches[0];
            if (touch.clientY < 100) {
              oEvent.preventDefault();
            }
          }
        }
      });


    },



  };

}());

