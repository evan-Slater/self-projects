const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, ipcMain } = electron;
// inports from electron
let winfiles = ["gameRefrence","canvesBaseTest","myGame"];
let win;
let selector;
function windowOpender(window,holder){
    // create new window 
    holder = new BrowserWindow({
        // this line lets you uses  electron functions in the html file 
        webPreferences: { nodeIntegration: true }
    });
    //load html file
    holder.loadURL(url.format({
        // dirname == this file
        pathname: path.join(__dirname, ''+window+'.html'),
        protocal: 'File:',
        slashes: true
    }));
    // quit app when main window is closed 
    holder.on('closed', function () {
        console.log('closing');
        holder = null;
    });
}


//opening prefurd window
app.on('ready',()=>{
    windowOpender('windowOpener',selector);
})
ipcMain.on('giveWin',(event)=>{
    event.reply('reseveWin',winfiles);
})
ipcMain.on('openThis',(event,window)=>{
      windowOpender(window,win);
})

//this is to be able to send info whenever not needing a event to respond to
var winAddres;
ipcMain.on("location",(event)=>{
    winAddres = event;
})