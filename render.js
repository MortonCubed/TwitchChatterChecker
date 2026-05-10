const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const { shell } = require('electron');
const path = require('path');
window.getChattersAndDownload = getChattersAndDownload;
const notificationSound = new Audio('audio.mp3')
notificationSound.volume=1;
    const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';           // Your Twitch App Client ID ./
    const ACCESS_TOKEN = 'jckhnogr0zl5o0plwfn608hoo47r0u';        // User Access Token with moderator:read:chatters scope
    const BROADCASTER_ID = '909343587';                            // Channel / Broadcaster ID
    const MODERATOR_ID = '909343587';
function openTxtInNotepad() {
  const fileName = 'usernamelist.txt'; 
  const filePath = path.join(__dirname, fileName);
  shell.openPath(filePath)
    .then((error) => {
      if (error) {
        console.error('Failed to open file:', error);
        alert('Cannot open the file.\nMake sure yourfile.txt exists in the same folder as the app.');
      } else {
        setTimeout(() => {
          alert("Delete the unwanted names,after that do control+s ,finally close the notepad and you're done!");
        }, 1000);
        
      }
    })
    .catch((err) => {
      console.error('Error:', err);
      alert('Error opening file: ' + err.message);
    });
}
document.getElementById("openButton").addEventListener("click", openTxtInNotepad);
async function getChattersAndDownload() {
      const resultDiv = document.getElementById('result');
      
      resultDiv.textContent = 'Fetching chatters from Twitch...';
      

      const url = `https://api.twitch.tv/helix/chat/chatters?broadcaster_id=${BROADCASTER_ID}&moderator_id=${MODERATOR_ID}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const chatters = data.data || [];

        if (chatters.length === 0) {
          resultDiv.textContent = "No chatters found or channel is offline.";
          return;
        }
        const content = fs.readFileSync('usernamelist.txt', 'utf8');
    const lines = content.split(/\r?\n/);
      
    
        // ← put the username you want to watch
        var j=0;
        const found=false;
      while(found===false){
        const targetUsername = lines[j];
        console.log(lines.length);
       
         const foundUser = chatters.find(user => 
            user.user_login.toLowerCase() === targetUsername.toLowerCase(),
         
        );
    
        if(foundUser){
          resultDiv.innerHTML = `<strong>${foundUser.user_login}</strong> is in chat right now!`;
            notificationSound.play().catch;
          break;
        }
        
       
        else if(j===lines.length-1 && found===false){
             console.log(`No one from the list is in chat right now.`);
            resultDiv.textContent = `not one person in the list is not in chat.`;
            break;
        }
        else {
           j++;
        }
      }
      } catch (error) {
        console.error(error);
        resultDiv.textContent = ` Error: ${error.message}`;
      }
    }
        document.getElementById('InsertUser').addEventListener('click', () => {
          const resultDiv2 = document.getElementById('result2');
    const userinput = document.getElementById('UserList').value.trim();
    dataToAppend=userinput + '\n';
    const content = fs.readFileSync('usernamelist.txt', 'utf8');
    const lines = content.split(/\r?\n/);
    fs.appendFile('usernamelist.txt', dataToAppend, (err) => {
    if (err) throw err;
     console.log('Saved!');
});
    console.log(lines[0]);
   resultDiv2.textContent = `"${userinput}" is inserted to the list!`;
return;
  });
    document.getElementById('registerBtn').addEventListener('click', () => {
    const hotkeyInput1 = document.getElementById('hotkeyInput').value.trim();
    const hotkeyInput = hotkeyInput1[0];
    const statusDiv = document.getElementById('status');

    if (!hotkeyInput) {
        statusDiv.textContent = "Please enter a hotkey";
        statusDiv.className = "status error";
        return;
    }

    // Send to main process to register the global shortcut
    ipcRenderer.send('register-hotkey', hotkeyInput);

    statusDiv.textContent = `Hotkey "${hotkeyInput}" registered! Press it anytime.`;
    statusDiv.className = "status success";
});
    ipcRenderer.on('global-hotkey-pressed', (event, data) => {
    console.log(`Hotkey detected: ${data}`);
    getChattersAndDownload();
});


