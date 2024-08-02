let audio;

function playSound() {
    if (audio) {
        audio.pause();
        audio = null;
    }
    audio = new Audio(chrome.runtime.getURL('assets/tada.mp3'));
    audio.play();
}

function sendTelegramMessage() {
    chrome.storage.local.get(['botToken', 'chatId'], function(result) {
        const botToken = result.botToken;
        const chatId = result.chatId;
        const msg = encodeURIComponent('Macro has been stopped. Please check your reservation status.');
        if (botToken && chatId) {
            const url = `https://api.telegram.org/bot${botToken}/sendmessage?chat_id=${chatId}&text=${msg}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => console.log('Telegram message sent:', data))
                .catch(error => console.error('Error sending Telegram message:', error));
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'playSound') {
        playSound();
        sendTelegramMessage();
        sendResponse(true);
    }
    return true; // 비동기 응답을 위해 true 반환
});