"use-strict";


fiveCrowns.pageReorderView = (function () {

  return {


    /**
     * Method for page layout.
     */
    layout: function (oApp) {

      // Create page
      var page = new sap.m.Page("pageReorder", { title: "Reorder Players" });

      // Build menu button
      var menuItemBack = new sap.m.MenuItem({ icon: "sap-icon://nav-back", text: "Back", press: function () { fiveCrowns.pageReorderController.onReorderBack(oApp); } });

      var menuReorder = new sap.m.Menu({ items: [] });
      var menuButtonReorder = new sap.m.MenuButton({ icon: "sap-icon://menu2", menu: menuReorder });

      // Add menu etc to Header toolbar
      var barReorderHeader = new sap.m.Toolbar({ id: "idBarReorderHeader" });
      barReorderHeader.addContent(new sap.m.Image({ src: "resources/crown.png", width: "80px", height: "45px" }));
      barReorderHeader.addContent(new sap.m.Text({ text: "Five Crowns" }));
      barReorderHeader.addContent(new sap.m.ToolbarSpacer());
      // barReorderHeader.addContent(menuButtonReorder);
      barReorderHeader.addContent(new sap.m.Button({ icon: "sap-icon://nav-back", press: function () { fiveCrowns.pageReorderController.onReorderBack(oApp); } }));
      page.setCustomHeader(barReorderHeader);



      // Table layout
      tabReorder = new sap.m.Table({ id: "idPlayerReorder", sticky: ["ColumnHeaders", "HeaderToolbar", "InfoToolbar"], mode: "SingleSelectMaster" });
      var oModel = new sap.ui.model.json.JSONModel(fiveCrowns.model.getReorderModel());
      tabReorder.setModel(oModel);

      // Add columns
      // tabReorder.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Drag and Drop or use buttons" }) }));
      tabReorder.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Player" }) }));
      tabReorder.addColumn(new sap.m.Column({ id: "playerUp", header: new sap.m.Text({ text: "" }) }));
      tabReorder.addColumn(new sap.m.Column({ id: "playerDown", header: new sap.m.Text({ text: "" }) }));
      // tabReorder.addColumn(new sap.m.Column({ header: new sap.m.Text({ text: "Position" }) }));
      columns = tabReorder.getColumns();
      for (let index = 0; index < columns.length; index++) {
        column = columns[index];
        if (column.getId() == "playerUp" || column.getId() == "playerDown") {
          tabReorder.getColumns()[index].setWidth("60px");
        }
      }

      // Add cells
      colItemPlayer = new sap.m.ColumnListItem({});
      colItemPlayer.addCell(new sap.m.Text({ text: "{playerName}" }));
      colItemPlayer.addCell(new sap.m.Button({ icon: "sap-icon://navigation-up-arrow", press: function () { fiveCrowns.pageReorderController.onPlayerUp(this); } }));
      colItemPlayer.addCell(new sap.m.Button({ icon: "sap-icon://navigation-down-arrow", press: function () { fiveCrowns.pageReorderController.onPlayerDown(this); } }));
      // colItemPlayer.addCell(new sap.m.Input({ id: "idPlayerPosition", value: "{playerPosition}", change: function () { fiveCrowns.pageReorderController.onReorderChange(this) } }));


      tabReorder.bindAggregation("items", "/players", colItemPlayer);
      page.addContent(tabReorder);


      // Add page to app
      oApp.addPage(page);



     // Add drag and drop with animation
     let draggedElement = null;
     tabReorder.attachBrowserEvent("touchstart", function (oEvent) {
       const target = oEvent.target;
       if (target.closest(".sapMText")) {
         const row = $(target).closest("tr").get(0);
         if (row) {
           draggedElement = row;
           $(draggedElement).addClass("dragging"); // Add dragging class for animation
           // console.log("Dragging started on row:", row);
         }
       }
     });
     tabReorder.attachBrowserEvent("touchmove", function (oEvent) {
       if (draggedElement) {
         const touch = oEvent.touches[0];
         $(draggedElement).css({
           top: touch.pageY + 'px',
           left: touch.pageX + 'px'
         });
       }
     });
     tabReorder.attachBrowserEvent("touchend", function (oEvent) {
       const touch = oEvent.changedTouches[0];
       const dropTarget = document.elementFromPoint(touch.pageX, touch.pageY);
       const targetRow = $(dropTarget).closest("tr").get(0);
       if (targetRow && draggedElement) {
         // console.log(`Dragged row from ${draggedElement.id} to ${targetRow.id}`);
         fiveCrowns.pageReorderController.onDragAndDrop(draggedElement.id.split('-')[2], targetRow.id.split('-')[2]);
       }
       $(draggedElement).removeClass("dragging"); // Remove dragging class after drop
       draggedElement = null;  // Reset dragged element
     });



     // Load custom CSS
      jQuery.sap.includeStyleSheet("css/style.css");
      page.addStyleClass("myCustomBackground");

      tabReorder.addStyleClass("myTableBackground");
      tabReorder.addStyleClass("myTableFontColor");
      tabReorder.addStyleClass("myTableFontSize");
      tabReorder.addStyleClass("myTableInputMargins");

    },



  };

}());
