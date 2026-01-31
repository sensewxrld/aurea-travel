import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginScreen({ user, onLogin }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/perfil");
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!identifier.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin({ identifier, password });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Entrar</h1>
          <p className="md-section-subtitle">
            Acesse sua área do cliente para acompanhar viagens e favoritos.
          </p>
        </div>
      </div>
      <div className="md-auth-card">
        <form onSubmit={handleSubmit} className="md-auth-form">
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="login-identifier">
              Email ou telefone
            </label>
            <input
              id="login-identifier"
              className="md-field-input"
              type="text"
              placeholder="voce@exemplo.com ou (11) 99999-9999"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="login-password">
              Senha
            </label>
            <input
              id="login-password"
              className="md-field-input"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="md-primary-button md-auth-submit"
            disabled={isSubmitting || !identifier.trim()}
          >
            <span>Entrar</span>
          </button>
        </form>
        <div className="md-auth-hint">
          Login simulado, sem envio de dados para servidores externos.
        </div>
        <div className="md-auth-hint">
          Ainda não tem conta?{" "}
          <button
            type="button"
            className="md-link-button"
            onClick={() => navigate("/cadastro")}
          >
            Criar conta
          </button>
        </div>
      </div>
    </section>
  );
}

export default LoginScreen;
