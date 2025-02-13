import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-overlay">
          <h1>Welcome to Insutech</h1>
          <p>Your trusted platform for seamless and secure insurance management.</p>
          <div className="cta-buttons">
            <Link to="/create" className="btn">Create a Policy</Link>
            <Link to="/policies" className="btn">View Policies</Link>
            <Link to="/search" className="btn">Search Policies</Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="features">
        <div className="feature-card">
          <img src="/images/security-icon.png" alt="Security" />
          <h3>Secure Policies</h3>
          <p>We ensure your policies are managed securely and efficiently.</p>
        </div>
        <div className="feature-card">
          <img src="/images/fast-processing.png" alt="Fast Processing" />
          <h3>Quick Processing</h3>
          <p>Fast and hassle-free insurance policy management at your fingertips.</p>
        </div>
        <div className="feature-card">
          <img src="/images/support-icon.png" alt="Support" />
          <h3>24/7 Support</h3>
          <p>Our dedicated team is here to assist you anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
