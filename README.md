# PhishGuard AI

PhishGuard AI is an intelligent phishing detection platform that protects users from malicious URLs, emails, and SMS messages using Machine Learning and security heuristics.

## Project Structure

- `/backend`: Flask API backend that runs the phishing detection logic.
- `/frontend`: React + Vite frontend for the web application and threat dashboard.
- `/extension`: Chrome Extension for real-time browser protection.

## Setup Instructions

### 1. Start the Backend

Open a terminal, navigate to the `backend` folder, and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend

Open another terminal, navigate to the `frontend` folder, and run:

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 3. Install the Chrome Extension

1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click on **Load unpacked** in the top left corner.
4. Select the `extension` folder inside this project.
5. The PhishGuard AI extension is now installed! Pin it to your toolbar to see real-time alerts.

## How it works

- **Web Dashboard**: Use the dashboard to manually scan URLs, emails, and SMS messages. The app provides a threat score and a list of reasons for its prediction.
- **Chrome Extension**: Whenever you visit a webpage, the extension automatically sends the URL to the backend. If the URL is suspicious, it badges the extension icon with a red warning. You can click the icon to see a detailed report.
- **Machine Learning**: The `backend/ml_model.py` contains a mock heuristic and feature extraction pipeline similar to a Random Forest model. It evaluates URL length, keywords, HTTPS presence, and IP structures.
