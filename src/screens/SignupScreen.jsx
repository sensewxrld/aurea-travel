import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupScreen({ user, onSignup }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const formatPhone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(
        6
      )}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const isValidPhoneDigits = (digits) =>
    digits.length === 10 || digits.length === 11;

  useEffect(() => {
    if (user) {
      navigate("/perfil");
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmPasswordError("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const phoneDigits = onlyDigits(trimmedPhone);
    let hasError = false;

    if (!trimmedName) {
      setNameError("Informe seu nome completo.");
      hasError = true;
    }

    if (!trimmedEmail) {
      setEmailError("Informe seu email.");
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError("Digite um email válido.");
      hasError = true;
    }

    if (!phoneDigits) {
      setPhoneError("Informe um telefone com DDD.");
      hasError = true;
    } else if (!isValidPhoneDigits(phoneDigits)) {
      setPhoneError("Digite um telefone com DDD (10 ou 11 dígitos).");
      hasError = true;
    }

    if (!password || password.length < 6) {
      setPasswordError("Use ao menos 6 caracteres.");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não conferem.");
      hasError = true;
    }

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos e a política de privacidade.");
      hasError = true;
    } else if (hasError) {
      setError("Corrija os campos destacados antes de continuar.");
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSignup({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Criar conta</h1>
          <p className="md-section-subtitle">
            Cadastre-se para acompanhar viagens, favoritos e configurações.
          </p>
        </div>
      </div>
      <div className="md-auth-card">
        <form onSubmit={handleSubmit} className="md-auth-form">
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="signup-name">
              Nome completo
            </label>
            <input
              id="signup-name"
              className={
                nameError
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="text"
              placeholder="Como está no seu documento"
              value={name}
              onChange={(event) => {
                const nextValue = event.target.value;
                setName(nextValue);
                if (!nextValue.trim()) {
                  setNameError("Informe seu nome completo.");
                } else {
                  setNameError("");
                }
              }}
              autoComplete="name"
            />
            {nameError && <div className="md-field-error">{nameError}</div>}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className={
                emailError
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(event) => {
                const nextValue = event.target.value;
                setEmail(nextValue);
                const trimmed = nextValue.trim();
                if (!trimmed) {
                  setEmailError("Informe seu email.");
                } else if (!isValidEmail(trimmed)) {
                  setEmailError("Digite um email válido.");
                } else {
                  setEmailError("");
                }
              }}
              autoComplete="email"
            />
            {emailError && <div className="md-field-error">{emailError}</div>}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="signup-phone">
              Telefone
            </label>
            <input
              id="signup-phone"
              className={
                phoneError
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(event) => {
                const formatted = formatPhone(event.target.value);
                setPhone(formatted);
                const digits = onlyDigits(formatted);
                if (!digits) {
                  setPhoneError("Informe um telefone com DDD.");
                } else if (!isValidPhoneDigits(digits)) {
                  setPhoneError(
                    "Digite um telefone com DDD (10 ou 11 dígitos)."
                  );
                } else {
                  setPhoneError("");
                }
              }}
              autoComplete="tel"
              inputMode="tel"
            />
            {phoneError && <div className="md-field-error">{phoneError}</div>}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="signup-password">
              Senha
            </label>
            <input
              id="signup-password"
              className={
                passwordError
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="password"
              placeholder="Crie uma senha segura"
              value={password}
              onChange={(event) => {
                const nextValue = event.target.value;
                setPassword(nextValue);
                if (!nextValue || nextValue.length < 6) {
                  setPasswordError("Use ao menos 6 caracteres.");
                } else {
                  setPasswordError("");
                }
                if (confirmPassword && nextValue !== confirmPassword) {
                  setConfirmPasswordError("As senhas não conferem.");
                } else if (confirmPassword) {
                  setConfirmPasswordError("");
                }
              }}
              autoComplete="new-password"
            />
            {passwordError && (
              <div className="md-field-error">{passwordError}</div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="signup-password-confirm">
              Confirmar senha
            </label>
            <input
              id="signup-password-confirm"
              className={
                confirmPasswordError
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(event) => {
                const nextValue = event.target.value;
                setConfirmPassword(nextValue);
                if (password && nextValue !== password) {
                  setConfirmPasswordError("As senhas não conferem.");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              autoComplete="new-password"
            />
            {confirmPasswordError && (
              <div className="md-field-error">{confirmPasswordError}</div>
            )}
          </div>
          <label className="md-checkbox-row">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
            />
            <span>
              Li e aceito os{" "}
              <span className="md-link-inline">termos de uso</span> e a{" "}
              <span className="md-link-inline">política de privacidade</span>.
            </span>
          </label>
          {error && <div className="md-field-error">{error}</div>}
          <button
            type="submit"
            className="md-primary-button md-auth-submit"
            disabled={isSubmitting}
          >
            <span>Criar conta</span>
          </button>
        </form>
        <div className="md-auth-hint">
          Já tem conta?{" "}
          <button
            type="button"
            className="md-link-button"
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>
        </div>
      </div>
    </section>
  );
}

export default SignupScreen;
