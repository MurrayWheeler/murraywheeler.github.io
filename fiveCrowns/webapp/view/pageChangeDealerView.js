"use-strict";


fiveCrowns.pageChangeDealerView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageChangeDealer", { title: "Change Dealer" });

      // Build menu button
      var menuItemBack = new sap.m.MenuItem({ icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageChangeDealerController.onChangeDealerBack(oApp); } });

      // var menuDealer = new sap.m.Menu({ items: [menuItemBack] });
      var menuDealer = new sap.m.Menu({ items: [] });
      var menuButtonDealer = new sap.m.MenuButton({ icon: "sap-icon://menu2", menu: menuDealer });

      // Add menu etc to Header toolbar
      var barDealerHeader = new sap.m.Toolbar({ id: "idBarDealerHeader" });
      barDealerHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barDealerHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barDealerHeader.addContent(new sap.m.ToolbarSpacer());
      // barDealerHeader.addContent(menuButtonDealer);
      barDealerHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageChangeDealerController.onChangeDealerBack(oApp); } }));
      page.setCustomHeader(barDealerHeader);


      // Table layout
      tabChangeDealer = new sap.m.Table({ id: "idChangeDealer", sticky: ["ColumnHeaders", "HeaderToolbar", "InfoToolbar"] });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.model.getChangeDealerModel());
      tabChangeDealer.setModel(oModel);

      // Add columns
      tabChangeDealer.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Select" }) }));
      tabChangeDealer.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Player" }) }));
      tabChangeDealer.getColumns()[0].setWidth("25%");

      // Add cells
      colItemDealer = new sap.m.ColumnListItem({});
      // colItemDealer.addCell(new sap.m.RadioButton({ value: "{selected}", change: function () { fiveCrowns.pageChangeDealerController.onChangeDealer(this) } }));
      // colItemDealer.addCell(new sap.m.RadioButton({ id: "idRadioButton", groupName: "rbGroup1" }));
      colItemDealer.addCell(new sap.m.RadioButton({ selected: "{selected}", groupName: "rbGroup1" }));
      colItemDealer.addCell(new sap.m.Text({ text: "{playerName}" }));

      tabChangeDealer.bindAggregation("items", "/players", colItemDealer);
      page.addContent(tabChangeDealer);


      // Add page to app
      oApp.addPage(page);

      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");

      tabChangeDealer.addStyleClass("myTableBackground");
      tabChangeDealer.addStyleClass("myTableFontColor");
      tabChangeDealer.addStyleClass("myTableFontSize");
      tabChangeDealer.addStyleClass("myTableInputMargins");


    },



  };

}());

