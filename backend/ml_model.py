import re
import random

# In a real application, you would load a trained Scikit-learn Random Forest model here.
# e.g., model = joblib.load('random_forest_model.pkl')

def extract_features(content, content_type):
    features = {}
    reasons = []
    
    if content_type == 'url':
        # Length
        features['length'] = len(content)
        if len(content) > 75:
            reasons.append("URL is unusually long")
            
        # Missing HTTPS
        if not content.startswith('https://'):
            reasons.append("Missing HTTPS (not secure)")
            features['has_https'] = 0
        else:
            features['has_https'] = 1
            
        # Suspicious keywords
        suspicious_words = ['login', 'verify', 'update', 'secure', 'bank', 'account']
        found_words = [word for word in suspicious_words if word in content.lower()]
        if found_words:
            reasons.append(f"Contains suspicious keywords: {', '.join(found_words)}")
            features['suspicious_keywords'] = len(found_words)
            
        # IP Address instead of domain
        if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', content):
            reasons.append("Uses an IP address instead of a domain name")
            features['has_ip'] = 1
        else:
            features['has_ip'] = 0
            
        # Special chars
        if '@' in content:
            reasons.append("Contains special character '@' which is highly suspicious in URLs")
            features['has_at'] = 1
            
    else:
        # Email or SMS
        urgent_words = ['act now', 'verify immediately', 'urgent', 'suspend']
        found_urgent = [word for word in urgent_words if word in content.lower()]
        if found_urgent:
            reasons.append(f"Contains urgent language: {', '.join(found_urgent)}")
            
        if 'password' in content.lower() or 'otp' in content.lower():
            reasons.append("Requests for password or OTP")
            
        if 'http' in content:
            reasons.append("Contains embedded links")
            
    return features, reasons

def predict_phishing(content, content_type):
    features, reasons = extract_features(content, content_type)
    
    # Mock Random Forest Prediction based on extracted features
    # In reality, this would be: score = model.predict_proba([list(features.values())])[0][1] * 100
    
    base_score = 10
    if content_type == 'url':
        if not features.get('has_https', True): base_score += 30
        if features.get('length', 0) > 75: base_score += 15
        if features.get('has_ip', False): base_score += 40
        if features.get('has_at', False): base_score += 40
        base_score += features.get('suspicious_keywords', 0) * 15
    else:
        base_score += len(reasons) * 25
        
    score = min(base_score, 100)
    
    if score == 10 and not reasons:
        reasons.append("No suspicious indicators found by ML model")
        
    return {
        'score': score,
        'reasons': reasons
    }
