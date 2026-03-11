const express = require('express');
const router = express.Router();
const path = require('path');

// Privacy Policy HTML
const privacyPolicyHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Laseria</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: linear-gradient(135deg, #fef9f0 0%, #fde68a 100%);
            min-height: 100vh;
            padding: 24px 16px;
        }
        .container {
            max-width: 720px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.10);
        }
        .header {
            background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
            padding: 36px 40px 28px;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .shield-icon {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.25);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }
        .header-text h1 {
            color: #ffffff;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header-text .last-updated {
            color: rgba(255,255,255,0.80);
            font-size: 13px;
            margin-top: 4px;
        }
        .body {
            padding: 32px 40px 40px;
        }
        .intro {
            color: #6b7280;
            font-size: 15px;
            margin-bottom: 28px;
            line-height: 1.7;
        }
        .section {
            border-left: 4px solid #F59E0B;
            background: #fafafa;
            border-radius: 0 12px 12px 0;
            padding: 20px 22px;
            margin-bottom: 16px;
        }
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 10px;
        }
        .section-body {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.75;
            white-space: pre-line;
        }
        .section-body strong {
            color: #111827;
            font-weight: 600;
        }
        .footer {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 28px;
            padding-top: 20px;
            border-top: 1px solid #f3f4f6;
            color: #9ca3af;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .header { padding: 28px 24px 22px; }
            .body { padding: 24px 20px 32px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="shield-icon">&#128737;</div>
            <div class="header-text">
                <h1>Privacy Policy</h1>
                <div class="last-updated">Last updated: March 2026</div>
            </div>
        </div>

        <div class="body">
            <p class="intro">
                This Privacy Policy explains how Laseria ("we", "our", or "us") collects, uses, and protects your information when you use our mobile application. By using the app, you agree to the practices described in this policy.
            </p>

            <div class="section">
                <div class="section-title">1. Information We Collect</div>
                <div class="section-body"><strong>Account Information:</strong>
When you register, we collect your salon name, email address, phone number, and business address.

<strong>Customer Data:</strong>
You may enter customer names, phone numbers, email addresses, and notes. This data belongs to you and is stored securely on our servers.

<strong>Appointment Data:</strong>
We store appointment records you create, including dates, services, and associated customer information.

<strong>Usage Data:</strong>
We may collect anonymous technical data such as device type, operating system version, and app usage patterns to improve performance.

<strong>Device Features:</strong>
When you tap a customer's phone number, the app uses your device's native dialer to initiate the call. We do not collect, transmit, or store any call data, call history, or phone numbers beyond what you have already entered into the app.</div>
            </div>

            <div class="section">
                <div class="section-title">2. How We Use Your Information</div>
                <div class="section-body">• Provide and operate the app and its features
• Authenticate your account and keep it secure
• Store and retrieve your salon and customer records
• Respond to support requests
• Improve and maintain the application
• Comply with legal obligations</div>
            </div>

            <div class="section">
                <div class="section-title">3. Data Sharing &amp; Disclosure</div>
                <div class="section-body">We do <strong>not</strong> sell, rent, or trade your personal data to third parties.

We may share data only in these limited cases:
• With service providers who help us operate the app (e.g., cloud hosting), under strict confidentiality agreements
• When required by law, court order, or governmental authority
• To protect the rights, safety, or property of our users or the public</div>
            </div>

            <div class="section">
                <div class="section-title">4. Data Retention &amp; Deletion</div>
                <div class="section-body">We retain your data for as long as your account is active.

You can permanently delete your account and all associated data at any time via <strong>Profile → Delete Account</strong>. Deletion is immediate and irreversible — all salon data, customer records, and appointments are permanently removed from our servers.

Anonymous usage analytics, if collected, are retained for up to 12 months.</div>
            </div>

            <div class="section">
                <div class="section-title">5. Your Rights</div>
                <div class="section-body">Depending on your location, you may have the right to:
• <strong>Access</strong> the personal data we hold about you
• <strong>Correct</strong> inaccurate information via Edit Profile
• <strong>Delete</strong> your account and all associated data
• <strong>Export</strong> your data upon request
• <strong>Object</strong> to certain processing of your information

To exercise any of these rights, contact us at the address below.</div>
            </div>

            <div class="section">
                <div class="section-title">6. Security</div>
                <div class="section-body">We use industry-standard security measures to protect your data, including:
• Encrypted data transmission (HTTPS/TLS)
• Secure password hashing (bcrypt)
• Token-based authentication (JWT)
• Access controls limiting who can view your data

No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</div>
            </div>

            <div class="section">
                <div class="section-title">7. Children's Privacy</div>
                <div class="section-body">This app is intended for business use by adults. We do not knowingly collect personal information from anyone under the age of 13 (or 16 in the EU). If you believe a minor has provided us with personal data, please contact us and we will delete it promptly.</div>
            </div>

            <div class="section">
                <div class="section-title">8. Changes to This Policy</div>
                <div class="section-body">We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. Continued use of the app after changes constitutes acceptance of the revised policy. We encourage you to review this policy periodically.</div>
            </div>

            <div class="section">
                <div class="section-title">9. Contact Us</div>
                <div class="section-body">If you have any questions, requests, or concerns about this Privacy Policy or your data, please contact us:

<strong>LASERIA</strong>
<a href="mailto:laseriaapp@gmail.com" style="color:#F59E0B;font-weight:600;">laseriaapp@gmail.com</a></div>
            </div>

            <div class="footer">
                &#128737; Compliant with Apple App Store &amp; Google Play Store privacy requirements
            </div>
        </div>
    </div>
</body>
</html>
`;

// Serve privacy policy
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(privacyPolicyHTML);
});

module.exports = router;

