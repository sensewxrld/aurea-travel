import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";

function LoginScreen() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/perfil");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will happen in useEffect when currentUser updates
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("Email ou senha incorretos.");
      } else if (err.code === 'auth/user-not-found') {
        setError("Usuário não encontrado.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Senha incorreta.");
      } else {
        setError("Falha ao entrar. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
          {error && <div className="md-alert-error" style={{marginBottom: '1rem', color: 'var(--md-color-error)'}}>{error}</div>}
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="md-field-input"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
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
              required
            />
          </div>
          <button
            type="submit"
            className="md-primary-button md-auth-submit"
            disabled={isSubmitting || !email.trim() || !password.trim()}
          >
            <span>{isSubmitting ? "Entrando..." : "Entrar"}</span>
          </button>
        </form>
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
