import { TouchBarColorPicker } from "electron";

const electron = require('electron')
const url = require('url')
const path = require('path')
// inports from electron
const { app, BrowserWindow, Menu, ipcMain } = electron

// this is so that the windows will stay open
let mainWindow
let addWindow

// lisen for app to be ready
app.on('ready',function(){
    // create new window 
    mainWindow = new BrowserWindow({
        // this line lets you uses  electron functions in the html file 
        webPreferences: {nodeIntegration: true} 
    })
    //load html file
    mainWindow.loadURL(url.format({
        // dirname == this file
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocal:'File:',
        slashes: true
    }))
    // quit app when main window is closed 
    mainWindow.on('closed',function(){
        app.quit()
    })

    //build menu from templat
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
   // console.log('i got here')
    // insert menu
    Menu.setApplicationMenu(mainMenu)
})

// handle creat add window
function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'temp text',
        webPreferences: {nodeIntegration: true} 
    })
    //load html file
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocal:'File:',
        slashes: true
    }))
    // garbage ccolection makein shore everything is closed
    addWindow.on('close',function(){
        addWindow = null
    })
}

// catch item:add
ipcMain.on('item:add', function(e, item){
   // console.log(item)
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

//creat menu temp dropdown tabes
const mainMenuTemplate = [
    {
        // top tabs
        label:'file',
        // what is in the tab
        submenu: [
            {   
                label: 'add item',
                click(){
                   createAddWindow()
                }            
            },
            {   
                label: 'clear items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {   
                label: 'quit',
                // see what sistem is on and key bind to close out
                accelerator: process.platform == 'darwin' ? 'Command+Q': 'ctrl+Q',
                click()
                {   
                    app.quit()
                }
            }
        ]
    }
]

// if mac add epty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift()
}

// add dev tools if not in production 
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu:[
            {
                label: 'toggle devTools',
                accelerator: process.platform == 'darwin' ? 'Command+I': 'ctrl+I',
                click( item, focusedwindow){
                    focusedwindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}