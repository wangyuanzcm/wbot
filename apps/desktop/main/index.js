"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const electron_1 = require("electron");
// import isDev from "electron-is-dev";
const isDev = false;
// function sleep(seconds: number) {
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, seconds);
//   });
// }
const preload = (0, path_1.join)(__dirname, "preload.js");
// https://www.electronjs.org/zh/docs/latest/api/command-line-switches
// app.commandLine.appendSwitch('remote-debugging-port', '8315')
// app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')
// Prepare the renderer once the app is ready
electron_1.app.on("ready", async () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload,
        },
    });
    // 获取默认的会话对象
    const defaultSession = electron_1.session.defaultSession;
    // 设置代理服务器
    defaultSession.setProxy({
        proxyRules: 'http://127.0.0.1:7890',
        // proxyBypassRules: '<local>'
    });
    // 默认视图
    const defaultView = new electron_1.BrowserView({ webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload,
        } });
    mainWindow.setBrowserView(defaultView);
    const url = isDev
        ? "http://127.0.0.1:3000/"
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../renderer/out/index.html"),
            protocol: "file:",
            slashes: true,
        });
    defaultView.webContents.loadURL(url);
    // 智能问答视图
    const conversionView = new electron_1.BrowserView();
    conversionView.webContents.loadURL("https://poe.com/");
    mainWindow.loadURL((0, url_1.format)({
        pathname: (0, path_1.join)(__dirname, "../views/index.html"),
        protocol: "file:",
        slashes: true,
    }));
    const { width, height } = mainWindow.getBounds();
    console.log(height, 'height');
    const viewsHeight = height - 36;
    defaultView.setBounds({ x: 0, y: 36, width: width, height: viewsHeight });
    // mainWindow.webContents.openDevTools();
    const views = {
        "tab1": defaultView,
        "tab2": conversionView
    };
    // tabs切换，多标签页切换
    //https://blog.csdn.net/m0_72713573/article/details/130037609
    electron_1.ipcMain.on("change-view", (_event, message) => {
        console.log(message, 'message');
        if (views[message]) {
            mainWindow.setBrowserView(views[message]);
            handleResize();
        }
    });
    function handleResize() {
        const { width, height } = mainWindow.getBounds();
        const viewsHeight = height - 36;
        conversionView.setBounds({ x: 0, y: 36, width, height: viewsHeight });
        defaultView.setBounds({ x: 0, y: 36, width, height: viewsHeight });
    }
    handleResize();
    mainWindow.on('resize', () => {
        handleResize();
    });
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", electron_1.app.quit);
