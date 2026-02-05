import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo-aurea.png";

function Header({ onClientAreaClick }) {
  const { currentUser } = useAuth();
  
  // Create a user object compatible with the existing rendering logic if needed,
  // or update the rendering logic to use currentUser directly.
  const user = currentUser ? {
    name: currentUser.displayName || currentUser.email.split('@')[0],
    ...currentUser
  } : null;

  return (
    <header className="md-header">
      <div className="md-header-inner">
        <Link to="/" className="md-brand">
          <img
            src={logo}
            alt="Auréa Travel"
            className="md-brand-logo"
          />
          <div className="md-brand-text">
            <span className="md-brand-name">Auréa Travel</span>
          </div>
        </Link>
        <button
          className="md-header-ghost-button"
          type="button"
          onClick={onClientAreaClick}
        >
          {user ? (
            <>
              <span className="md-header-ghost-badge">conectado</span>
              <span className="md-header-ghost-name">{user.name}</span>
            </>
          ) : (
            <>
              <span className="md-header-ghost-badge">login</span>
              <span>Área do cliente</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
