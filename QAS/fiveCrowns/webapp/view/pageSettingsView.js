"use-strict";


fiveCrowns.pageSettingsView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageSettings", { title: "Settings" });

      // Build menu button
      var menuItemBack = new sap.m.MenuItem({ icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageSettingsController.onSettingsBack(oApp); } });
      var menuSettings = new sap.m.Menu({ items: [] });
      var menuButtonSettings = new sap.m.MenuButton({ icon: "sap-icon://menu2", menu: menuSettings });

      // Add menu etc to Header toolbar
      var barSettingsHeader = new sap.m.Toolbar({ id: "idBarSettingsHeader" });
      barSettingsHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barSettingsHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barSettingsHeader.addContent(new sap.m.ToolbarSpacer());
      // barSettingsHeader.addContent(menuButtonSettings);
      barSettingsHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageSettingsController.onSettingsBack(oApp); } }));
      page.setCustomHeader(barSettingsHeader);

      
      // Form layout
      frmSettings = new sap.ui.layout.form.SimpleForm({ id: "idSettings", title: "Settings" });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.settings.oSettings);
      frmSettings.setModel(oModel);

      frmSettings.addContent(new sap.m.Label({ text: "Portrait round prefix (requires restart)" }));
      frmSettings.addContent(new sap.m.Input({ value: "{/roundPrefixP}", change: function () { fiveCrowns.pageSettingsController.onTimeout(this) } }));
      frmSettings.addContent(new sap.m.Label({ text: "Landscape round prefix (requires restart)" }));
      frmSettings.addContent(new sap.m.Input({ value: "{/roundPrefixL}", change: function () { fiveCrowns.pageSettingsController.onTimeout(this) } }));
      // frmSettings.addContent(new sap.m.Label({ text: "Default player prefix" }));
      // frmSettings.addContent(new sap.m.Input({ value: "{/playerPrefix}" }));
      frmSettings.addContent(new sap.m.Label({ text: "Screen timeout (seconds)" }));
      frmSettings.addContent(new sap.m.Input({ value: "{/screenTimeout}", type: "Number", change: function () { fiveCrowns.pageSettingsController.onTimeout(this) } }));

      page.addContent(frmSettings);


      // Add page to app
      oApp.addPage(page);

      // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");
      frmSettings.addStyleClass("myLabelFontColorBlack");

    },



  };

}());

