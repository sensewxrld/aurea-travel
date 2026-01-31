import React from "react";
import logo from "../assets/logo-aurea.png";

function Header({ user, onClientAreaClick }) {
  return (
    <header className="md-header">
      <div className="md-header-inner">
        <div className="md-brand">
          <img
            src={logo}
            alt="Auréa Travel"
            className="md-brand-logo"
          />
          <div className="md-brand-text">
            <span className="md-brand-name">Auréa Travel</span>
          </div>
        </div>
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
