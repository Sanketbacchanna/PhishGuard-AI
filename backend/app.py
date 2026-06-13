from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import random
from ml_model import predict_phishing
import os
import hashlib

app = Flask(__name__)
CORS(app)

# Dummy APIs config
# VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
# GOOGLE_SAFE_BROWSING_API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'PhishGuard AI Backend is running!',
        'status': 'success',
        'frontend_url': 'http://localhost:5173'
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    content = data.get('content', '')
    content_type = data.get('type', 'url') # url, email, sms
    
    if not content:
        return jsonify({'error': 'No content provided'}), 400
        
    # ML Prediction
    ml_result = predict_phishing(content, content_type)
    
    # External Verification Mock (simulating VirusTotal / Google Safe Browsing)
    security_check = check_security_apis(content)
    
    # Combine results
    threat_score = (ml_result['score'] * 0.7) + (security_check['score'] * 0.3)
    
    if threat_score > 70:
        status = 'Phishing'
        risk_level = 'High'
    elif threat_score > 40:
        status = 'Suspicious'
        risk_level = 'Medium'
    else:
        status = 'Safe'
        risk_level = 'Low'
        
    reasons = ml_result['reasons'] + security_check['reasons']
    
    response = {
        'threat_score': round(threat_score),
        'status': status,
        'risk_level': risk_level,
        'reasons': reasons,
        'timestamp': data.get('timestamp')
    }
    
    # TODO: Store in MongoDB
    
    return jsonify(response)
    
def check_security_apis(content):
    # Mock function to simulate API calls to VirusTotal & Google Safe Browsing
    # Using hash to make the mock deterministic so the same URL always gives the same result
    hash_val = int(hashlib.md5(content.encode('utf-8')).hexdigest(), 16)
    content_lower = content.lower()
    
    suspicious_indicators = ['login', 'verify', 'update', 'secure', 'bank', 'account', 'suspicious', 'suspisious', 'free', 'prize']
    
    if any(word in content_lower for word in suspicious_indicators):
        score = 80 + (hash_val % 21) # 80-100
    elif "http://" in content_lower:
        score = 40 + (hash_val % 31) # 40-70
    elif re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', content):
        score = 85 + (hash_val % 16) # 85-100
    else:
        score = hash_val % 30 # 0-29
        
    reasons = []
    if score > 50:
        reasons.append("Flagged by security vendor APIs")
        
    return {'score': score, 'reasons': reasons}

@app.route('/api/stats', methods=['GET'])
def get_stats():
    # Mock dashboard stats
    return jsonify({
        'total_scans': 12450,
        'safe': 8200,
        'suspicious': 2100,
        'phishing': 2150,
        'recent': [
            {'url': 'http://secure-login-update.com', 'score': 95, 'status': 'Phishing'},
            {'url': 'https://google.com', 'score': 5, 'status': 'Safe'},
            {'url': 'http://bit.ly/123xyz', 'score': 55, 'status': 'Suspicious'},
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
