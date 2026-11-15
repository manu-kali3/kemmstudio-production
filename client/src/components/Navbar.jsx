import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">Kemmstudio <span>Production</span></Link>
        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/contact">Booking</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <button className="btn btn-outline" onClick={logout} style={{padding:'.45rem .8rem'}}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  );
}
