"use-strict";


fiveCrowns.pageGameController = (function () {

    function hideUnusedPlayers(players) {
        for (let playerNum = 0; playerNum < fiveCrowns.model.getMaxPlayers(); playerNum++) {
            columnNum = playerNum + 1;  // Offset for "Round" column
            if (playerNum < players) {
                tabRounds.getColumns()[columnNum].setVisible(true);
                barTotal.getContent()[columnNum].setVisible(true);
                tabPlayers.getItems()[playerNum].setVisible(true);
            } else {
                tabRounds.getColumns()[columnNum].setVisible(false);
                barTotal.getContent()[columnNum].setVisible(false);
                tabPlayers.getItems()[playerNum].setVisible(false);
            }
        }
    };

    function refreshPlayerNames(playerCount) {
        var oGame = fiveCrowns.model.getModel();
        for (let playerNum = 0; playerNum < playerCount; playerNum++) {
            column = playerNum + 1;
            tabRounds.getColumns()[column].getHeader().setValue(oGame.players[playerNum].playerName);
        }
    };

    function refreshScreenTotals(playerCount) {
        var oGame = fiveCrowns.model.getModel();
        for (let playerNum = 0; playerNum < playerCount; playerNum++) {
            elementId = "total" + playerNum;
            totalElement = sap.ui.getCore().byId(elementId)
            if (totalElement) {
                totalElement.setValue(oGame.totals[playerNum]);
            }
        }
    };

    function setReorderTable() {
        var oReorder = fiveCrowns.model.getReorderModel();
        var players = fiveCrowns.model.getModel().players;
        oReorder.players.splice(0, oReorder.players.length);
        for (let playerNum = 0; playerNum < fiveCrowns.model.getPlayerCount(); playerNum++) {
            oReorder.players.push({ playerPosition: playerNum + 1, playerName: players[playerNum].playerName });
        }
        tabReorder.getModel().refresh();
    };

    function setChangeDealerTable() {
        var oGame = fiveCrowns.model.getModel();
        var oChangeDealer = fiveCrowns.model.getChangeDealerModel();
        var players = oGame.players;
        oChangeDealer.players.splice(0, oChangeDealer.players.length);   // Clear pre-existing entries
        for (let playerNum = 0; playerNum < oGame.playerCount; playerNum++) {
            oChangeDealer.players.push({ selected: false, playerName: players[playerNum].playerName });
        }
        // Set current dealer
        currentDealer = oGame.currentDealer;
        oChangeDealer.players[currentDealer].selected = true;
        tabChangeDealer.getModel().refresh();
    };

    function handleDealer() {
        var oGame = fiveCrowns.model.getModel();
        var currentRound = calcCurrentRound(oGame);
        oGame.setCurrentRound(currentRound);
        var currentDealer = getCurrentDealer(currentRound, oGame);
        oGame.setCurrentDealer(currentDealer);
        highlightDealer(oGame);
    };


    function handleRound() {
        unHighlightRoundLabels();
        highlightRoundLabel(oGame.currentDealer);  
    };


    function calcCurrentRound(oGame) {
        // Current round is the latest round with no score against a player
        var currentRound = null;
        var maxRounds = fiveCrowns.model.getMaxRounds() - 1;     // Sub one for array index
        // for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
        for (let roundNum = maxRounds; roundNum >= 0; roundNum--) {
            for (let playerNum = 0; playerNum < oGame.playerCount; playerNum++) {
                if (oGame.scores[roundNum].roundScores[playerNum] !== '') {
                    currentRound = roundNum;
                    break;
                }
            };
            if (currentRound != null) break;
        }
        if (currentRound == null) currentRound = 0; // Default to round zero
        // Check if round is complete
        var roundComplete = true;
        for (let playerNum = 0; playerNum < oGame.playerCount; playerNum++) {
            if (oGame.scores[currentRound].roundScores[playerNum] == '') {
                roundComplete = false;
                break;
            }
        }
        if (roundComplete) {
            currentRound = currentRound + 1;
        }
        return currentRound;
    };

    function getCurrentDealer(currentRound, oGame) {
        // Calculate current dealer using initial dealer, rounds, and player count
        dealer = oGame.initialDealer + currentRound;
        dealer = dealer % oGame.playerCount;   // MOD function
        return dealer;
    };

    function highlightDealer(oGame) {
        unHighlightDealerLabels(oGame.playerCount);
        highlightDealerLabel(oGame.currentDealer);  
    };


    function unHighlightDealerLabels(playerCount) {
        for (let playerNum = 0; playerNum < playerCount; playerNum++) {
            // Portrait (column headers)
            column = playerNum + 1; // Offset to step over "Round" column
            tabRounds.getColumns()[column].getHeader().setValueState("None");
            tabRounds.getColumns()[column].getHeader().setValueStateText("");
            if (tabRounds.getColumns()[column].getHeader().getValue()[0] == '*') {
                tabRounds.getColumns()[column].getHeader().setValue(tabRounds.getColumns()[column].getHeader().getValue().substring(1));
            }
            // Landscape (column 1)
            tabPlayers.getItems()[playerNum].getCells()[0].setValueState("None");
            tabPlayers.getItems()[playerNum].getCells()[0].setValueStateText("");
            if (tabPlayers.getItems()[playerNum].getCells()[0].getValue()[0] == '*') {
                tabPlayers.getItems()[playerNum].getCells()[0].setValue(tabPlayers.getItems()[playerNum].getCells()[0].getValue().substring(1));
            }
        }
    }


    function highlightDealerLabel(currentDealer) {
        column = currentDealer + 1; // Offset to step over "Round" column
        tabRounds.getColumns()[column].getHeader().setValueState("Error");
        tabRounds.getColumns()[column].getHeader().setValueStateText("Dealer");
        tabRounds.getColumns()[column].getHeader().setValue('*' + tabRounds.getColumns()[column].getHeader().getValue());
        tabPlayers.getItems()[currentDealer].getCells()[0].setValueState("Error");
        tabPlayers.getItems()[currentDealer].getCells()[0].setValueStateText("Dealer");
        tabPlayers.getItems()[currentDealer].getCells()[0].setValue('*' + tabPlayers.getItems()[currentDealer].getCells()[0].getValue());
    }


    function highlightRound(oGame) {
        // Unhighlight all rounds
        for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
            for (let playerNum = 0; playerNum < oGame.playerCount; playerNum++) {
                unHighlightCell(roundNum, playerNum);
            }
        }
        // highlightCell(oGame.getCurrentRound(), oGame.currentDealer);
        // Highlight dealer in all rounds
        for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
            for (let playerNum = 0; playerNum < oGame.playerCount; playerNum++) {
                let dealerCol = (oGame.initialDealer + roundNum) % oGame.playerCount;
                if (playerNum == dealerCol) {
                    highlightCell(roundNum, playerNum);
                }
            }
        }
    };


    function unHighlightCell(row, column) {
        // Portrait cell
        rowPort = row;
        colPort = column + 1;   // Offset for "Round" column
        // Portrait
        tabRounds.getItems()[rowPort].getCells()[colPort].setValueState("None");
        tabRounds.getItems()[rowPort].getCells()[colPort].setValueStateText("");
        // In landscape the row and column are swapped
        rowLand = column;
        colLand = row + 1;  // Offset for "Player" column 
        // Landscape 
        tabPlayers.getItems()[rowLand].getCells()[colLand].setValueState("None");
        tabPlayers.getItems()[rowLand].getCells()[colLand].setValueStateText("");
    };


    function highlightCell(row, column) {
        // Portrait cell
        rowPort = row;
        colPort = column + 1;   // Offset for "Round" column
        // Portrait
        tabRounds.getItems()[rowPort].getCells()[colPort].setValueState("Information");
        tabRounds.getItems()[rowPort].getCells()[colPort].setValueStateText("Dealer");
        // In landscape the row and column are swapped
        rowLand = column;
        colLand = row + 1;  // Offset for "Player" column 
        // Landscape 
        tabPlayers.getItems()[rowLand].getCells()[colLand].setValueState("Information");
        tabPlayers.getItems()[rowLand].getCells()[colLand].setValueStateText("Dealer");
    };



    function unHighlightRoundLabels() {
        for (let roundNum = 0; roundNum < fiveCrowns.model.getMaxRounds(); roundNum++) {
            // Portrait (column 1)
            if (tabRounds.getItems()[roundNum].getCells()[0].getText()[0] == '*') {
                tabRounds.getItems()[roundNum].getCells()[0].setText(tabRounds.getItems()[roundNum].getCells()[0].getText().substring(1));
            }
            // Landscape (column header)
            column = roundNum + 1; // Offset to step over "Player" column
            if (tabPlayers.getColumns()[column].getHeader().getText()[0] == '*') {
                tabPlayers.getColumns()[column].getHeader().setText(tabPlayers.getColumns()[column].getHeader().getText().substring(1));
            }
        }
    }


    function highlightRoundLabel() {
        var currentRound = fiveCrowns.model.getModel().getCurrentRound(oGame);
        column = currentRound + 1; // Offset to step over "Player" column
        tabRounds.getItems()[currentRound].getCells()[0].setText('*' + tabRounds.getItems()[currentRound].getCells()[0].getText());
        tabPlayers.getColumns()[column].getHeader().setText('*' + tabPlayers.getColumns()[column].getHeader().getText());
    }


    function tabStopSet() {
        if (sap.ui.Device.orientation.portrait) return;   // Only for landscape
        let playerCount = fiveCrowns.model.getModel().playerCount;
        tabPlayers.getItems().forEach(function (oItem, rowIndex) {
            oItem.getCells().forEach(function (oCell, cellIndex) {
                if (oCell.isA("sap.m.Input")) { // Check if the cell contains an input field
                    let iTabIndex = (rowIndex + 1) + (cellIndex * playerCount);
                    var tabIndex = "" + iTabIndex;  // tabIndex as a string
                    var elementId = oCell.getId() + "-inner";
                    // We need to get the "-inner" to set the tabstop. Eg. r-0-idGameLTable-0-inner
                    if (rowIndex < playerCount) {
                        elementRef = document.getElementById(elementId);
                        elementRef.tabIndex = tabIndex;
                    }
                }
            });
        });
    };



    return {

        hideUnusedPlayers: hideUnusedPlayers,
        refreshScreenTotals: refreshScreenTotals,
        refreshPlayerNames: refreshPlayerNames,
        highlightDealer: highlightDealer,
        highlightRound: highlightRound,
        setReorderTable: setReorderTable,
        tabStopSet: tabStopSet,


        onPlayerChange: function (element) {
            requestFullScreen();
            var playerName = element.getValue();
            var elementId = element.getId();
            if (sap.ui.Device.orientation.portrait) {
                var playerNum = elementId.split('-')[1];
            } else {
                var playerNum = elementId.split('-')[2];
            };
            fiveCrowns.model.updatePlayerName(playerNum, playerName);
            refreshPlayerNames(players);
            if (sap.ui.Device.orientation.portrait) {
                tabRounds.getModel().refresh();
            } else {
                tabPlayers.getModel().refresh();
            };
            hideKeyboard(element.getId() + "-inner");
        },

        onScoreChange: function (element) {
            var score = element.getValue();
            var elementId = element.getId();
            if (sap.ui.Device.orientation.portrait) {
                var round = Number(elementId.split('-')[3]);
                var player = Number(elementId.split('-')[1]);
            } else {
                var round = Number(elementId.split('-')[1]);
                var player = Number(elementId.split('-')[3]);
            }
            oGame = fiveCrowns.model.getModel();
            oGame.setScore(round, player, score);
            fiveCrowns.model.updateTotals();
            refreshScreenTotals(oGame.playerCount);
            handleDealer();
            handleRound();
            // highlightRound(oGame);
            hideKeyboard(element.getId() + "-inner");
        },


        onReorderPlayers: function (oApp) {
            requestFullScreen();
            if (sap.ui.Device.orientation.portrait) {
                sap.ui.getCore().byId("popoverGame").close()
            } else {
                sap.ui.getCore().byId("popoverGameL").close()
            }
            setReorderTable();
            oApp.to("pageReorder", fiveCrowns.settings.oSettings.getPageTransition());
            sap.m.MessageToast.show("Drag and Drop names or use buttons");
        },

        onDealerChange: function (oApp) {
            requestFullScreen();
            if (sap.ui.Device.orientation.portrait) {
                sap.ui.getCore().byId("popoverGame").close()
            } else {
                sap.ui.getCore().byId("popoverGameL").close()
            }
            setChangeDealerTable();
            oApp.to("pageChangeDealer", fiveCrowns.settings.oSettings.getPageTransition());
        },

        onClearScores: function () {
            requestFullScreen();
            // Save game
            oGame = fiveCrowns.model.getModel();
            fiveCrowns.games.modifyGame(oGame);
            fiveCrowns.games.saveGames();
            fiveCrowns.model.saveGame(oGame);
            fiveCrowns.model.clearScores();
            if (sap.ui.Device.orientation.portrait) {
                sap.ui.getCore().byId("popoverGame").close()
                tabRounds.getModel().refresh();
                tabRounds.scrollToIndex(0);
                refreshScreenTotals(fiveCrowns.model.getPlayerCount());
            } else {
                sap.ui.getCore().byId("popoverGameL").close()
                tabPlayers.getModel().refresh();
            }
        },

        onNewGame: function () {
            requestFullScreen();
            // Save game
            oGame = fiveCrowns.model.getModel();
            fiveCrowns.games.modifyGame(oGame);
            fiveCrowns.games.saveGames();
            fiveCrowns.model.saveGame(oGame);
            fiveCrowns.model.newGame();
            fiveCrowns.model.clearScores();
            if (sap.ui.Device.orientation.portrait) {
                sap.ui.getCore().byId("popoverGame").close()
                tabRounds.getModel().refresh();
                refreshScreenTotals(fiveCrowns.model.getPlayerCount());
                tabRounds.scrollToIndex(0);
            } else {
                sap.ui.getCore().byId("popoverGameL").close()
                tabPlayers.getModel().refresh();
                tabPlayers.scrollToIndex(0);
            }
        },

        onResume: function () {
            requestFullScreen();
            fiveCrowns.pageGameController.setGameEditable(true);
            if (sap.ui.Device.orientation.portrait) {
                sap.ui.getCore().byId("popoverGame").close()
            } else {
                sap.ui.getCore().byId("popoverGameL").close()
                // Pause for a second, to give the fields time to become enabled
                // There might be a better way to do this. I couldn't find an event for when the field actually became enabled on the screen
                setTimeout(function () { tabStopSet(); }, 1000);
            }
        },

        onBack: function (oApp) {
            requestFullScreen();
            if (sap.ui.Device.orientation.landscape) {
                sap.ui.getCore().byId("popoverGameL").close()
            }
            oApp.back();
            // Save game
            oGame = fiveCrowns.model.getModel();
            fiveCrowns.games.modifyGame(oGame);
            fiveCrowns.games.saveGames();
            fiveCrowns.model.saveGame(oGame);
        },

        setGameEditable: function (isEditable) {
            setTableEditable(tabRounds, isEditable);
            setTableEditable(tabPlayers, isEditable);
            // Set popover menu item "Reorder players"
            sap.ui.getCore().byId("popoverGame").getContent()[0].getItems()[0].setEnabled(isEditable);
            sap.ui.getCore().byId("popoverGameL").getContent()[0].getItems()[0].setEnabled(isEditable);
            // Set popover menu item "Change Dealer"
            sap.ui.getCore().byId("popoverGame").getContent()[0].getItems()[1].setEnabled(isEditable);
            sap.ui.getCore().byId("popoverGameL").getContent()[0].getItems()[1].setEnabled(isEditable);
            // Toggle New game and Resume game
            sap.ui.getCore().byId("popoverGame").getContent()[0].getItems()[2].setVisible(isEditable);
            sap.ui.getCore().byId("popoverGameL").getContent()[0].getItems()[2].setVisible(isEditable);
            sap.ui.getCore().byId("popoverGame").getContent()[0].getItems()[3].setVisible(!isEditable);
            sap.ui.getCore().byId("popoverGameL").getContent()[0].getItems()[3].setVisible(!isEditable);
        },



    };

}());
