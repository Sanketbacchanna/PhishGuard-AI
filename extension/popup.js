document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let currentTab = tabs[0];
        let url = currentTab.url;
        
        if (url.startsWith('chrome://') || url.startsWith('edge://')) {
            showResult({
                status: 'Safe',
                threat_score: 0,
                reasons: ['System page (safe by default)']
            }, url);
            return;
        }

        chrome.storage.local.get([url], (result) => {
            if (result[url]) {
                // If we already have the result from background script
                showResult(result[url], url);
            } else {
                // Otherwise, analyze now
                fetch('http://localhost:5000/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: url, type: 'url', timestamp: new Date().toISOString() })
                })
                .then(response => response.json())
                .then(data => {
                    chrome.storage.local.set({ [url]: data });
                    showResult(data, url);
                    
                    // Update badge
                    let color = data.status === 'Safe' ? '#00FF00' : '#FF0000';
                    let text = data.status === 'Safe' ? '✓' : '!';
                    chrome.action.setBadgeText({text: text, tabId: currentTab.id});
                    chrome.action.setBadgeBackgroundColor({color: color, tabId: currentTab.id});
                })
                .catch(error => {
                    document.getElementById('loading').textContent = 'Error: Make sure backend is running (localhost:5000)';
                    console.error('Error:', error);
                });
            }
        });
    });
});

function showResult(data, url) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    const scoreCircle = document.getElementById('score-circle');
    const statusText = document.getElementById('status');
    const urlText = document.getElementById('url');
    const reasonsList = document.getElementById('reasons-list');
    
    scoreCircle.textContent = data.threat_score + '%';
    statusText.textContent = data.status.toUpperCase();
    urlText.textContent = url;
    
    if (data.status === 'Safe') {
        scoreCircle.className = 'score-circle safe';
        statusText.style.color = '#22c55e';
    } else if (data.status === 'Suspicious') {
        scoreCircle.className = 'score-circle suspicious';
        statusText.style.color = '#f59e0b';
    } else {
        scoreCircle.className = 'score-circle phishing';
        statusText.style.color = '#ef4444';
    }
    
    reasonsList.innerHTML = '';
    data.reasons.forEach(reason => {
        let li = document.createElement('li');
        li.textContent = reason;
        reasonsList.appendChild(li);
    });
}
