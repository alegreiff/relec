import { app, BrowserWindow } from "electron";
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourcesManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

//type test = string;
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });
});
