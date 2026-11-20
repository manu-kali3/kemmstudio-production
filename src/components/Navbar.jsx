import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronRight, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { NAV_LINKS } from '../data/site';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  // The drawer is tied to the route it was opened on, so navigating
  // (including browser back/forward) closes it without an extra effect.
  const [openedOn, setOpenedOn] = useState(null);
  const open = openedOn === pathname;
  const closeDrawer = () => setOpenedOn(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll + allow Escape while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('is-locked');
    const onKeyDown = (e) => e.key === 'Escape' && setOpenedOn(null);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <header className={`nav${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label={`${'Kemmstudio Production'} — home`}>
          <Logo />
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user nav-desktop-only">
                <span className="avatar" aria-hidden="true">
                  {initial}
                </span>
                {user.name || user.email}
              </span>
              <button type="button" className="icon-btn nav-desktop-only" onClick={logout} aria-label="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-ghost btn-sm nav-desktop-only">
              Login
            </Link>
          )}
          <Link to="/contact" className="btn btn-primary btn-sm nav-desktop-only">
            Book a session
            <ArrowRight size={16} className="btn-arrow" />
          </Link>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setOpenedOn((v) => (v === pathname ? null : pathname))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="drawer"
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeDrawer}
          >
            <motion.nav
              className="drawer-panel"
              aria-label="Mobile"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={closeDrawer}
                  className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                >
                  {link.label}
                  <ChevronRight size={18} />
                </NavLink>
              ))}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={closeDrawer}
                  className={({ isActive }) => `drawer-link${isActive ? ' active' : ''}`}
                >
                  Admin dashboard
                  <LayoutDashboard size={18} />
                </NavLink>
              )}

              <div className="drawer-footer">
                <Link to="/contact" onClick={closeDrawer} className="btn btn-primary btn-block">
                  Book a session
                  <ArrowRight size={16} className="btn-arrow" />
                </Link>
                {user ? (
                  <button
                    type="button"
                    className="btn btn-outline btn-block"
                    onClick={() => {
                      closeDrawer();
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                ) : (
                  <Link to="/login" onClick={closeDrawer} className="btn btn-outline btn-block">
                    Login
                  </Link>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
