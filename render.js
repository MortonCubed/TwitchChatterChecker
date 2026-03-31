const ipcRenderer = require('electron').ipcRenderer;
window.getChattersAndDownload = getChattersAndDownload;
const notificationSound = new Audio('audio.mp3')
    const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';           // Your Twitch App Client ID ./
    const ACCESS_TOKEN = '1036di2q3lhchj7tt7plhd7vo1k3i1';        // User Access Token with moderator:read:chatters scope
    const BROADCASTER_ID = '909343587';                            // Channel / Broadcaster ID
    const MODERATOR_ID = '909343587';

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
        const targetUsername = "mortonz3";   // ← put the username you want to watch
      
     const foundUser = chatters.find(user => 
            user.user_login.toLowerCase() === targetUsername.toLowerCase()
        );
        if (foundUser) {
            resultDiv.innerHTML = `✅ <strong>${foundUser.user_login}</strong> is in chat right now! 🎵`;
            notificationSound.play().catch
        } else {
            console.log(`❌ ${targetUsername} is NOT in chat right now.`);
            resultDiv.textContent = `${targetUsername} is not in chat.`;
        }
      } catch (error) {
        console.error(error);
        resultDiv.textContent = `❌ Error: ${error.message}`;
      }
    }
    ipcRenderer.on('global-hotkey-pressed', (event, data) => {
    console.log(`Hotkey detected: ${data}`);
    getChattersAndDownload();
});


