// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog ,ipcMain} = require("electron");
const path = require("path");
const fs = require("fs");
// const { app, Menu } = require('electron')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  const template = [
    {
      label: "Files",
      submenu: [
        {
          label: "Open File",
          click: async () => {
            dialog
              .showOpenDialog(mainWindow, {
                properties: ["openFile"],
                filters: [
                  { name: "Movies", extensions: ["mkv", "avi", "mp4"] },
                  { name: "All Files", extensions: ["*"] },
                ],
              })
              .then((result) => {
                mainWindow.webContents.send("load-video",result.filePaths[0]);
              })
              .catch((err) => {
                console.log(err);
              });
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          role: "undo",
        },
        {
          role: "redo",
        },
        {
          type: "separator",
        },
        {
          role: "cut",
        },
        {
          role: "copy",
        },
        {
          role: "paste",
        },
      ],
    },

    {
      label: "View",
      submenu: [
        {
          role: "reload",
        },
        {
          role: "toggledevtools",
        },
        {
          type: "separator",
        },
        {
          role: "resetzoom",
        },
        {
          role: "zoomin",
        },
        {
          role: "zoomout",
        },
        {
          type: "separator",
        },
        {
          role: "togglefullscreen",
        },
      ],
    },

    {
      role: "window",
      submenu: [
        {
          role: "minimize",
        },
        {
          role: "close",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('load-video', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  createWindow()

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
