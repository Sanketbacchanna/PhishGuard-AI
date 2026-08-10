from ml_model import predict_phishing

test_urls = [
    ("https://google.com", "Safe Google"),
    ("http://192.168.1.1/login.php", "IP Address URL"),
    ("https://paypal-update-account-security-verify.com/login", "Phishing keyword and Prefix/Suffix hyphen"),
    ("http://bit.ly/345xyz", "Shortened URL"),
    ("https://login.live.com@attacker.com/signin", "At symbol redirection"),
    ("https://facebook.com-login-verify-account-security-update.com/login/auth/secure/session/identify", "Very long and deep url")
]

print("Starting Model Tests...\n")
for url, desc in test_urls:
    print(f"URL: {url} ({desc})")
    res = predict_phishing(url, 'url')
    print(f"  Score: {res['score']}%")
    print("  Reasons:")
    for reason in res['reasons']:
        print(f"    - {reason}")
    print("-" * 50)
