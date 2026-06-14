chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Exclude system pages and localhost for simple demo
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('localhost') || tab.url.startsWith('http://localhost') || tab.url.startsWith('http://127.0.0.1')) {
            return;
        }

        fetch('https://phishguard-ai-xex8.onrender.com/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: tab.url,
                type: 'url',
                timestamp: new Date().toISOString()
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'Phishing' || data.status === 'Suspicious') {
                    chrome.action.setBadgeText({ text: '!', tabId: tabId });
                    chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: tabId });

                    // Save the result for the popup
                    chrome.storage.local.set({ [tab.url]: data });
                } else {
                    chrome.action.setBadgeText({ text: '\u2713', tabId: tabId });
                    chrome.action.setBadgeBackgroundColor({ color: '#00FF00', tabId: tabId });
                    chrome.storage.local.set({ [tab.url]: data });
                }
            })
            .catch(error => console.error('Error analyzing URL:', error));
    }
});
