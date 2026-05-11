const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    chatContainer.innerText = 'Ойлануда...';
    sendBtn.disabled = true;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        if (data.error) {
            chatContainer.innerText = 'Қате: ' + data.error;
        } else {
            // Displaying response text from the structure requested:
            // data.candidates[0].content.parts[0].text
            chatContainer.innerText = data.candidates[0].content.parts[0].text;
        }
    } catch (err) {
        chatContainer.innerText = 'Жүйелік қате: ' + err.message;
    } finally {
        sendBtn.disabled = false;
        userInput.value = '';
    }
});
