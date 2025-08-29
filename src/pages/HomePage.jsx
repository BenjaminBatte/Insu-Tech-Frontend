import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-overlay">
          <h1>Welcome to Benjamin & Winnie Insutech</h1>
          <p>
            Effortless insurance management with security and speed you can
            trust.
          </p>
          <div className="cta-buttons">
            <Link to="/create" className="btn">
              Create a Policy
            </Link>
            <Link to="/policies" className="btn">
              View Policies
            </Link>
            <Link to="/search" className="btn">
              Search Policies
            </Link>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <img src="images/secure.png" alt="Security" />
          <h3>
            🔒 <Link to="/security-policy">Secure Policies</Link>
          </h3>
          <p>We ensure your policies are managed securely and efficiently.</p>
        </div>
        <div className="feature-card">
          <img src="images/fast.png" alt="Fast Processing" />
          <h3>
            ⚡ <Link to="/create">Quick Quote</Link>
          </h3>
          <p>Get an instant estimate for your insurance policy with ease.</p>
        </div>
        <div className="feature-card">
          <img src="images/support.png" alt="Support" />
          <h3>📞 24/7 Support</h3>
          <p>Our dedicated team is here to assist you anytime.</p>
          <div className="contact-info">
            <p>
              📧{" "}
              <a href="mailto:benjaminbatte@gmail.com">
                benjaminbatte@insutech.com
              </a>
            </p>
            <p>
              📱 <a href="tel:+16412330003">+1 641-233-0003</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
