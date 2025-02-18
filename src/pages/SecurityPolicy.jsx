import React from "react";
import { Link } from "react-router-dom";
import "../styles/SecurityPolicy.css"; 

const SecurityPolicy = () => {
  return (
    <div className="security-policy-container">
      <h1>🔒 Security & Privacy Policy</h1>
      <p><strong>Last Updated:</strong> 2025/01/10</p>

      <section>
        <h2>1️⃣ Data Encryption & Protection</h2>
        <p>
          We use <strong>end-to-end encryption</strong> to safeguard all sensitive data.
        </p>
        <ul>
          <li>🔹 <strong>SSL/TLS Encryption:</strong> Ensures secure data transmission.</li>
          <li>🔹 <strong>AES-256 Encryption:</strong> Protects stored policy information.</li>
          <li>🔹 <strong>Role-Based Access Control (RBAC):</strong> Limits data access to authorized users.</li>
        </ul>
      </section>

      <section>
        <h2>2️⃣ Compliance & Industry Standards ✅</h2>
        <p>We comply with globally recognized security regulations:</p>
        <ul>
          <li>✔️ <strong>GDPR</strong> – Protecting user privacy and data integrity.</li>
          <li>✔️ <strong>HIPAA</strong> – Ensuring compliance with healthcare insurance policies.</li>
          <li>✔️ <strong>SOC 2 Type II Certification</strong> – Commitment to security and confidentiality.</li>
        </ul>
      </section>

      <section>
        <h2>3️⃣ Fraud Prevention & Account Security 🚨</h2>
        <p>We take proactive measures to prevent fraudulent activities:</p>
        <ul>
          <li>🔹 <strong>Multi-Factor Authentication (MFA):</strong> Adds an extra security layer.</li>
          <li>🔹 <strong>Real-Time Threat Monitoring:</strong> Detects suspicious login attempts.</li>
          <li>🔹 <strong>Automatic Session Expiry:</strong> Logs out inactive sessions.</li>
          <li>🔹 <strong>AI-Powered Anti-Fraud:</strong> Detects unusual transaction behavior.</li>
        </ul>
      </section>

      <section>
        <h2>4️⃣ User Responsibilities & Best Practices 👨‍💻</h2>
        <ul>
          <li>✔️ Use strong passwords and enable MFA.</li>
          <li>✔️ Never share login credentials.</li>
          <li>✔️ Be aware of phishing scams.</li>
          <li>✔️ Regularly review account activity.</li>
        </ul>
      </section>

      <section>
        <h2>5️⃣ Data Breach & Incident Response ⚠️</h2>
        <p>In case of a security breach, we take immediate action:</p>
        <ol>
          <li>🔹 Containment and investigation.</li>
          <li>🔹 Affected users notified within 24 hours.</li>
          <li>🔹 Security patches applied to prevent future risks.</li>
        </ol>
      </section>

      <section>
        <h2>6️⃣ Contact Our Security Team 📩</h2>
        <p>If you notice suspicious activity, contact us:</p>
        <p>📧 <Link to="mailto:support@insutech.com">support@insutech.com</Link></p>
        <p>📞 <Link to="tel:+16412330003">+1 641-233-0003</Link></p>
      </section>

      <Link to="/" className="btn">🏠 Back to Home</Link>
    </div>
  );
};

export default SecurityPolicy;
