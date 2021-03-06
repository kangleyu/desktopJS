﻿const desktopJS = require('../../dist/desktop.js');
const electron = require('electron');
const app = electron.app;

let mainWindow;
let snapAssist;

function createWindow() {
    let container = desktopJS.resolveContainer();

    desktopJS.ContainerWindow.addListener("window-created", (e) => console.log("Window created - static (ContainerWindow): " + e.windowId + ", " + e.windowName));
    
    snapAssist = new desktopJS.SnapAssistWindowManager(container,
        {
            windowStateTracking: desktopJS.WindowStateTracking.Main | desktopJS.WindowStateTracking.Group
        });

    container.createWindow('http://localhost:8000', { name: "desktopJS", main: true }).then(win => mainWindow = win);
 
    let trayIcon = electron.nativeImage.createFromPath(__dirname + '\\..\\web\\favicon.ico');
    container.addTrayIcon({ icon: trayIcon, text: 'ContainerPOC' }, () => {
        mainWindow.isShowing().then((showing) => {
            if (showing) {
                mainWindow.hide();
            } else {
                mainWindow.show();
            }
        });
    }, [{ label: "Exit", click: (menuItem) => app.quit() }]);

	container.ipc.subscribe("stock.selected", function (event, message) {
		console.log("Message received: " + message.symbol);
    });
}

app.on("ready", createWindow);

