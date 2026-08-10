import os
import requests
import csv
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from urllib.parse import urlparse
import re
import joblib

DATASET_URL = "https://raw.githubusercontent.com/prabhnoor0212/malicious-website-detection/master/dataset.csv"
DATASET_PATH = "dataset.csv"
MODEL_PATH = "phishing_model.joblib"

def download_dataset():
    if not os.path.exists(DATASET_PATH):
        print(f"Downloading dataset from {DATASET_URL}...")
        response = requests.get(DATASET_URL)
        if response.status_code == 200:
            with open(DATASET_PATH, 'wb') as f:
                f.write(response.content)
            print("Dataset downloaded successfully.")
        else:
            raise Exception(f"Failed to download dataset. Status code: {response.status_code}")
    else:
        print("Dataset already exists locally.")

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
        import ipaddress
        ipaddress.ip_address(domain)
        return 1
    except:
        return 0

def extract_features_from_url(url):
    feats = {}
    normalized = normalize_url(url)
    domain = getDomain(url)
    
    # 1. Have IP
    feats['Have_IP'] = havingIP(url)
    
    # 2. Have @
    feats['Have_At'] = 1 if '@' in url else 0
    
    # 3. URL Length
    feats['URL_Length'] = 1 if len(url) >= 54 else 0
    
    # 4. URL Depth
    try:
        path = urlparse(normalized).path
        s = path.split('/')
        depth = sum(1 for val in s if len(val) != 0)
    except:
        depth = 0
    feats['URL_Depth'] = depth
    
    # 5. Redirection
    pos = url.rfind('//')
    feats['Redirection'] = 1 if pos > 7 else 0
    
    # 6. https Domain
    feats['https_Domain'] = 1 if 'https' in domain else 0
    
    # 7. Tiny URL
    shortening_services = r"bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs"
    feats['TinyURL'] = 1 if re.search(shortening_services, url) else 0
    
    # 8. Prefix Suffix
    feats['Prefix/Suffix'] = 1 if '-' in domain else 0
    
    # 9. Domain Length
    feats['Domain_Length'] = len(domain)
    
    # 10. Number of dots
    feats['No_of_Dots'] = url.count('.')
    
    # 11. Number of hyphens
    feats['No_of_Hyphens'] = url.count('-')
    
    # 12. Number of digits
    feats['No_of_Digits'] = sum(1 for c in url if c.isdigit())
    
    # 13. Number of special characters
    feats['No_of_SpecialChars'] = sum(1 for c in url if c in ['?', '=', '&', '%', '_'])
    
    # 14. Suspicious Keywords
    suspicious_words = ['login', 'verify', 'update', 'secure', 'bank', 'account', 'suspicious', 'suspisious', 'free', 'prize']
    feats['Suspicious_Keywords'] = sum(1 for w in suspicious_words if w in url.lower())
    
    return feats

def train_model():
    download_dataset()
    
    urls = []
    labels = []
    
    # Load dataset
    print("Parsing dataset...")
    with open(DATASET_PATH, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            # Skip initial GitHub header if downloading raw file
            if i < 4 and len(row) > 0 and row[0].startswith("Source:"):
                continue
            if len(row) < 2:
                continue
            url = row[0]
            label = 1 if row[-1] == 'yes' else 0
            urls.append(url)
            labels.append(label)
            
    print(f"Loaded {len(urls)} samples (Phishing: {sum(labels)}, Safe: {len(labels)-sum(labels)})")
    
    # Extract features
    print("Extracting features...")
    X = []
    for url in urls:
        feats = extract_features_from_url(url)
        vector = [
            feats['Have_IP'],
            feats['Have_At'],
            feats['URL_Length'],
            feats['URL_Depth'],
            feats['Redirection'],
            feats['https_Domain'],
            feats['TinyURL'],
            feats['Prefix/Suffix'],
            feats['Domain_Length'],
            feats['No_of_Dots'],
            feats['No_of_Hyphens'],
            feats['No_of_Digits'],
            feats['No_of_SpecialChars'],
            feats['Suspicious_Keywords']
        ]
        X.append(vector)
        
    X = np.array(X)
    y = np.array(labels)
    
    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Train RandomForestClassifier
    print("Training RandomForest Classifier...")
    clf = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importances
    feature_names = [
        'Have_IP', 'Have_At', 'URL_Length', 'URL_Depth', 'Redirection', 'https_Domain', 
        'TinyURL', 'Prefix/Suffix', 'Domain_Length', 'No_of_Dots', 'No_of_Hyphens', 
        'No_of_Digits', 'No_of_SpecialChars', 'Suspicious_Keywords'
    ]
    importances = clf.feature_importances_
    print("\nFeature Importances:")
    for col, imp in sorted(zip(feature_names, importances), key=lambda t: t[1], reverse=True):
        print(f"  {col}: {imp:.4f}")
        
    # Save model
    joblib.dump(clf, MODEL_PATH)
    print(f"\nModel successfully saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
