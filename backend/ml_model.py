import re
import os
import joblib
from urllib.parse import urlparse
import ipaddress

# Load the trained Random Forest model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'phishing_model.joblib')

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Successfully loaded phishing detection ML model.")
    else:
        print(f"Warning: ML model not found at {MODEL_PATH}. Using fallback heuristics.")
        model = None
except Exception as e:
    print(f"Error loading ML model: {e}. Using fallback heuristics.")
    model = None

# Shortening services pattern
shortening_services = (
    r"bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\\.co|tinyurl|tr\.im|is\.gd|cli\.gs|"
    r"yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|"
    r"short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|"
    r"doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|db\.tt|"
    r"qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|q\.gs|is\.gd|"
    r"po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|x\.co|"
    r"prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|"
    r"tr\.im|link\.zip\.net"
)

def normalize_url(url):
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    return url

def getDomain(url):
    try:
        normalized = normalize_url(url)
        domain = urlparse(normalized).netloc
        if re.match(r"^www\.", domain):
            domain = domain.replace("www.", "")
        return domain
    except:
        return url

def havingIP(url):
    domain = getDomain(url)
    try:
        ipaddress.ip_address(domain)
        return 1
    except:
        return 0

def haveAtSign(url):
    return 1 if "@" in url else 0

def getLength(url):
    return 0 if len(url) < 54 else 1

def getDepth(url):
    try:
        normalized = normalize_url(url)
        path = urlparse(normalized).path
        s = path.split('/')
        depth = 0
        for val in s:
            if len(val) != 0:
                depth += 1
        return depth
    except:
        return 0

def redirection(url):
    pos = url.rfind('//')
    if pos > 6:
        if pos > 7:
            return 1
        else:
            return 0
    else:
        return 0

def httpDomain(url):
    domain = getDomain(url)
    return 1 if 'https' in domain else 0

def tinyURL(url):
    match = re.search(shortening_services, url)
    return 1 if match else 0

def prefixSuffix(url):
    domain = getDomain(url)
    return 1 if '-' in domain else 0

def extract_features(content, content_type):
    features = {}
    reasons = []
    
    if content_type == 'url':
        url = content.strip()
        
        # 1. Have IP
        ip_flag = havingIP(url)
        features['Have_IP'] = ip_flag
        if ip_flag:
            reasons.append("Uses an IP address instead of a domain name (highly suspicious)")
            
        # 2. Have @
        at_flag = haveAtSign(url)
        features['Have_At'] = at_flag
        if at_flag:
            reasons.append("Contains special character '@' which is highly suspicious in URLs")
            
        # 3. URL Length
        len_flag = getLength(url)
        features['URL_Length'] = len_flag
        if len(url) > 75:
            reasons.append("URL is unusually long (longer than 75 characters)")
        elif len_flag:
            reasons.append("URL length is suspicious (longer than 53 characters)")
            
        # 4. URL Depth
        depth = getDepth(url)
        features['URL_Depth'] = depth
        if depth > 4:
            reasons.append(f"URL directory depth is unusually deep ({depth})")
            
        # 5. Redirection
        redir_flag = redirection(url)
        features['Redirection'] = redir_flag
        if redir_flag:
            reasons.append("Contains redirection '//' indicating potential hidden destinations")
            
        # 6. https Domain
        https_in_domain = httpDomain(url)
        features['https_Domain'] = https_in_domain
        if https_in_domain:
            reasons.append("Contains 'https' token in domain name to trick security scanners")
            
        # 7. Tiny URL
        tiny_flag = tinyURL(url)
        features['TinyURL'] = tiny_flag
        if tiny_flag:
            reasons.append("Uses a URL shortening service to hide the actual landing page")
            
        # 8. Prefix Suffix
        dash_flag = prefixSuffix(url)
        features['Prefix/Suffix'] = dash_flag
        if dash_flag:
            reasons.append("Domain name contains a hyphen '-' (often used to spoof brand names)")
            
        # 9. Domain Length
        domain = getDomain(url)
        features['Domain_Length'] = len(domain)
        if len(domain) > 30:
            reasons.append(f"Domain name length is unusually long ({len(domain)} characters)")
            
        # 10. Number of Dots
        dots = url.count('.')
        features['No_of_Dots'] = dots
        if dots > 4:
            reasons.append(f"Contains an excessive number of dots ({dots}) in the URL")
            
        # 11. Number of Hyphens
        hyphens = url.count('-')
        features['No_of_Hyphens'] = hyphens
        if hyphens > 3:
            reasons.append(f"Contains multiple hyphens ({hyphens}) in the URL")
            
        # 12. Number of Digits
        digits = sum(1 for c in url if c.isdigit())
        features['No_of_Digits'] = digits
        if digits > 10:
            reasons.append(f"Contains a high number of digits ({digits}) in the URL")
            
        # 13. Number of Special Characters
        specials = sum(1 for c in url if c in ['?', '=', '&', '%', '_'])
        features['No_of_SpecialChars'] = specials
        if specials > 5:
            reasons.append("Contains many query parameters/special characters")
            
        # 14. Suspicious Keywords
        suspicious_words = ['login', 'verify', 'update', 'secure', 'bank', 'account', 'suspicious', 'suspisious', 'free', 'prize']
        found_words = [word for word in suspicious_words if word in url.lower()]
        features['Suspicious_Keywords'] = len(found_words)
        if found_words:
            reasons.append(f"Contains suspicious keyword(s): {', '.join(found_words)}")
            
        # Extra heuristics (not in the ML feature list but useful for reasons)
        if not url.startswith('https://') and not url.startswith('https%3A%2F%2F'):
            reasons.append("Missing HTTPS (connection is not secure)")
            
    else:
        # Email or SMS
        urgent_words = ['act now', 'verify immediately', 'urgent', 'suspend']
        found_urgent = [word for word in urgent_words if word in content.lower()]
        if found_urgent:
            reasons.append(f"Contains urgent language: {', '.join(found_urgent)}")
            
        if 'password' in content.lower() or 'otp' in content.lower():
            reasons.append("Requests for sensitive info (password or OTP)")
            
        if 'http' in content:
            reasons.append("Contains embedded links")
            
    return features, reasons

def predict_phishing(content, content_type):
    features, reasons = extract_features(content, content_type)
    
    if content_type == 'url':
        if model is not None:
            # Prepare feature vector in the EXACT order the model was trained on:
            feature_vector = [
                features['Have_IP'],
                features['Have_At'],
                features['URL_Length'],
                features['URL_Depth'],
                features['Redirection'],
                features['https_Domain'],
                features['TinyURL'],
                features['Prefix/Suffix'],
                features['Domain_Length'],
                features['No_of_Dots'],
                features['No_of_Hyphens'],
                features['No_of_Digits'],
                features['No_of_SpecialChars'],
                features['Suspicious_Keywords']
            ]
            
            # Predict probability of phishing (class 1)
            prob = model.predict_proba([feature_vector])[0][1]
            score = prob * 100
        else:
            # Fallback heuristic
            base_score = 10
            if features.get('Have_IP'): base_score += 40
            if features.get('Have_At'): base_score += 40
            if features.get('URL_Length'): base_score += 15
            if features.get('Redirection'): base_score += 30
            if features.get('https_Domain'): base_score += 30
            if features.get('TinyURL'): base_score += 25
            if features.get('Prefix/Suffix'): base_score += 20
            score = min(base_score, 100)
    else:
        # Email/SMS heuristic score
        base_score = 10
        base_score += len(reasons) * 30
        score = min(base_score, 100)
        
    score = round(score)
    
    if score < 20 and not reasons:
        reasons.append("No suspicious indicators found by ML model")
        
    return {
        'score': score,
        'reasons': reasons
    }

