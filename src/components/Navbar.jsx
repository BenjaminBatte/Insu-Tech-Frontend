import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-heading">Insure<span className="highlight">Pro</span></h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create">Create Policy</Link></li>
        <li><Link to="/policies">View Policies</Link></li>
        <li><Link to="/search">Search Policies</Link></li>
        <li><Link to="/users">User Management</Link></li>
        <li><a href="/managed-policies">Managed Policies</a></li>

      </ul>
    </nav>
  );
};

export default Navbar;