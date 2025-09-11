// General utility methods



function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


// Function to request full screen mode
async function requestFullScreen() {
    // try {
    //     // Going to fullscreen. Need to be linked to a button press (I don't know why)
    //     // https://wiki.appstudio.dev/How_to_run_fullscreen_in_an_Android_Chrome_app
    //     document.documentElement.webkitRequestFullScreen();
    //     console.log('Full screen mode');
    //     resetTimeout();
    // } catch (err) {
    //     console.error('Failed to go full screen:', err);
    // }
}


// Function to exit full screen mode
async function exitFullScreen() {
    try {
        document.webkitExitFullscreen();
        console.log('Exited full screen mode');
    } catch (err) {
        console.error('Failed to exit full screen:', err);
    }
}


async function hideKeyboard(inputId) {
    var inputDom = document.getElementById(inputId);
    if (inputDom) {
        inputDom.blur();
        // Dynamically create and focus a hidden input, then remove it
        var tempInput = document.createElement("input");
        tempInput.type = "text";
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        tempInput.style.top = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.focus();
        setTimeout(function () {
            document.body.removeChild(tempInput);
        }, 100);
    }
}


async function setTableEditable(tabTable, isEditable) {
    // Set headers
    var aColumns = tabTable.getColumns();
    aColumns.forEach(function (oColumn) {
        if (oColumn.getHeader() instanceof sap.m.Input) {
            oColumn.getHeader().setEditable(isEditable);
        }
    });
    // Set cells
    var aItems = tabTable.getItems();
    aItems.forEach(function (oItem) {
        var aCells = oItem.getCells();
        aCells.forEach(function (oCell) {
            if (oCell instanceof sap.m.Input) {
                oCell.setEditable(isEditable);
            }
        });
    });
}



