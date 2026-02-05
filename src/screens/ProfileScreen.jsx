import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { signOut, updateProfile, updateEmail, updatePassword, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  IconUser,
  IconHeart,
  IconBriefcase,
  IconCreditCard,
  IconReceipt,
  IconSettings,
  IconBell,
  IconGlobe,
  IconLock,
  IconShield,
  IconFileText,
  IconLogout,
  IconEdit,
  IconArrowLeft,
  IconHome,
  IconMapPin,
  IconEmail,
  IconMessage,
  IconSmartphone,
  IconMonitor,
  IconCheckCircle,
} from "../components/Icons";

function ProfileAvatar({ user, initials }) {
  if (!user) {
    return (
      <div className="md-profile-avatar">
        <span className="md-profile-avatar-icon">
          <IconUser width={26} height={26} />
        </span>
      </div>
    );
  }

  const hasImage = !!user.avatarUrl;

  return (
    <div className="md-profile-avatar">
      {hasImage ? (
        <img
          src={user.avatarUrl}
          alt={user.name || "Foto de perfil"}
          className="md-profile-avatar-img"
        />
      ) : (
        <span className="md-profile-avatar-label">{initials}</span>
      )}
    </div>
  );
}

function ProfileScreen({
  favoritesCount,
  reservationsCount,
  reservations = [],
  onUpdateUser,
  onDeleteAccount,
}) {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser;
  
  const user = currentUser ? {
    name: currentUser.displayName,
    email: currentUser.email,
    photoUrl: currentUser.photoURL,
    phone: currentUser.phoneNumber,
    // Provide defaults for other fields if needed or load from DB
    documentId: "",
    currency: "BRL - Real brasileiro",
    notifications: { email: true, sms: false, push: true },
    theme: "Claro"
  } : null;

  const initials = useMemo(() => {
    if (user && user.name) {
      return user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "AT";
  }, [user]);

  const [activeView, setActiveView] = useState("menu");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    documentId: user?.documentId || "",
  });
  const [settingsForm, setSettingsForm] = useState({
    language: language,
    currency: user?.currency || "BRL - Real brasileiro",
    notifications: user?.notifications || {
      email: true,
      sms: false,
      push: true,
    },
    theme: user?.theme || "Claro",
  });
  const [savedCards, setSavedCards] = useState([
    { id: "card-1", label: "Visa final 1234" },
    { id: "card-2", label: "Mastercard final 5678" },
  ]);
  const [cardForm, setCardForm] = useState({
    holderName: user?.name || "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [cardFormError, setCardFormError] = useState("");
  const [securityState, setSecurityState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    success: "",
  });
  const [profileErrors, setProfileErrors] = useState({
    name: "",
    email: "",
    phone: "",
    documentId: "",
  });

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

  const formatCpf = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 3) {
      return digits;
    }
    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9)}`;
  };

  const isValidCpfDigits = (digits) => digits.length === 11;

  const formatCardNumber = (value) => {
    const digits = onlyDigits(value).slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const isValidCardNumber = (value) => {
    const digits = onlyDigits(value);
    return /^[0-9]{13,19}$/.test(digits);
  };

  const formatExpiry = (value) => {
    const digits = onlyDigits(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isValidExpiry = (value) => {
    const digits = onlyDigits(value);
    if (digits.length !== 4) return false;
    const month = parseInt(digits.slice(0, 2), 10);
    const year = parseInt(digits.slice(2, 4), 10);
    if (!Number.isFinite(month) || !Number.isFinite(year)) return false;
    if (month < 1 || month > 12) return false;
    return true;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const nextErrors = {
      name: "",
      email: "",
      phone: "",
      documentId: "",
    };
    let hasError = false;

    if (!profileForm.name.trim()) {
      nextErrors.name = "Informe seu nome completo.";
      hasError = true;
    }

    if (!profileForm.email.trim()) {
      nextErrors.email = "Informe seu email.";
      hasError = true;
    } else if (!isValidEmail(profileForm.email)) {
      nextErrors.email = "Digite um email válido.";
      hasError = true;
    }

    const phoneDigits = onlyDigits(profileForm.phone);
    if (profileForm.phone && !isValidPhoneDigits(phoneDigits)) {
      nextErrors.phone = "Telefone inválido.";
      hasError = true;
    }

    const cpfDigits = onlyDigits(profileForm.documentId);
    if (profileForm.documentId && !isValidCpfDigits(cpfDigits)) {
      nextErrors.documentId = "CPF inválido.";
      hasError = true;
    }

    setProfileErrors(nextErrors);
    if (hasError) return;

    try {
      if (profileForm.name !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: profileForm.name,
        });
      }

      if (profileForm.email !== currentUser.email) {
        await updateEmail(currentUser, profileForm.email);
      }
      
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("Para alterar o email, é necessário fazer login novamente por segurança.");
      } else {
        alert("Erro ao atualizar perfil: " + error.message);
      }
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettingsForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "language") {
        changeLanguage(value);
      }
      return next;
    });
  };

  const handleRemoveCard = (cardId) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    setCardFormError("");
    const numberDigits = onlyDigits(cardForm.number);
    if (!isValidCardNumber(numberDigits)) {
      setCardFormError("Número do cartão inválido.");
      return;
    }
    if (!isValidExpiry(cardForm.expiry)) {
      setCardFormError("Validade inválida.");
      return;
    }
    if (cardForm.cvv.length < 3) {
      setCardFormError("CVV inválido.");
      return;
    }
    if (!cardForm.holderName.trim()) {
      setCardFormError("Nome impresso obrigatório.");
      return;
    }

    const newCard = {
      id: `card-${Date.now()}`,
      label: `Cartão final ${cardForm.number.slice(-4)}`,
    };
    setSavedCards((prev) => [...prev, newCard]);
    setCardForm({
      holderName: user?.name || "",
      number: "",
      expiry: "",
      cvv: "",
    });
    setActiveView("payments");
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityState((prev) => ({ ...prev, error: "", success: "" }));

    if (!securityState.currentPassword) {
      setSecurityState((prev) => ({
        ...prev,
        error: "Digite sua senha atual.",
      }));
      return;
    }
    if (securityState.newPassword.length < 6) {
      setSecurityState((prev) => ({
        ...prev,
        error: "A nova senha deve ter no mínimo 6 caracteres.",
      }));
      return;
    }
    if (securityState.newPassword !== securityState.confirmPassword) {
      setSecurityState((prev) => ({
        ...prev,
        error: "As senhas não conferem.",
      }));
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, securityState.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, securityState.newPassword);
      
      setSecurityState((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        success: "Senha alterada com sucesso!",
      }));
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      let errorMessage = "Erro ao alterar senha.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha atual incorreta.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Por favor, faça login novamente para alterar sua senha.";
      }
      
      setSecurityState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  };

  const handleDeleteAccountClick = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      try {
        await deleteUser(currentUser);
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        if (error.code === 'auth/requires-recent-login') {
          alert("Para excluir sua conta, é necessário fazer login novamente por segurança.");
        } else {
          alert("Erro ao excluir conta: " + error.message);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="md-section">
        <div className="md-section-header">
          <div>
            <h1 className="md-section-title">Minha Conta</h1>
            <p className="md-section-subtitle">
              Entre ou crie uma conta para aproveitar todos os recursos.
            </p>
          </div>
        </div>

        <div className="md-auth-card">
          <div className="md-profile-welcome">
            <div className="md-profile-welcome-icon">
              <IconUser width={40} height={40} />
            </div>
            <h2 className="md-profile-welcome-title">Bem-vindo ao Auréa Travel</h2>
            <p className="md-profile-welcome-text">
              Acesse suas reservas, salve destinos favoritos e gerencie seus dados com facilidade.
            </p>
          </div>

          <div className="md-auth-actions">
            <button
              type="button"
              className="md-primary-button md-auth-btn"
              onClick={() => navigate("/login")}
            >
              Entrar na conta
            </button>
            <button
              type="button"
              className="md-secondary-button md-auth-btn"
              onClick={() => navigate("/cadastro")}
            >
              Criar conta gratuita
            </button>
          </div>

          <div className="md-auth-features">
            <div className="md-auth-feature">
              <div className="md-auth-feature-icon">
                <IconBriefcase width={20} height={20} />
              </div>
              <div className="md-auth-feature-text">
                <strong>Gerencie suas viagens</strong>
                <span>Acesse passagens, reservas e roteiros em um só lugar.</span>
              </div>
            </div>
            <div className="md-auth-feature">
              <div className="md-auth-feature-icon">
                <IconHeart width={20} height={20} />
              </div>
              <div className="md-auth-feature-text">
                <strong>Salve seus favoritos</strong>
                <span>Crie listas de desejos para suas próximas aventuras.</span>
              </div>
            </div>
            <div className="md-auth-feature">
              <div className="md-auth-feature-icon">
                <IconBell width={20} height={20} />
              </div>
              <div className="md-auth-feature-text">
                <strong>Receba ofertas exclusivas</strong>
                <span>Seja o primeiro a saber sobre promoções e descontos.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleOpenView = (viewId) => {
    setActiveView(viewId);
  };

  const handleBackToMenu = () => {
    setActiveView("menu");
  };

  const menuSections = [
    {
      id: "section-account",
      title: t("menu_section_account"),
      items: [
        { id: "account-main", label: t("menu_my_account"), view: "account", icon: IconUser },
        { id: "account-favorites", label: t("menu_favorites"), view: "favorites", icon: IconHeart },
        {
          id: "account-trips",
          label: t("menu_my_trips"),
          view: "trips",
          icon: IconBriefcase,
        },
      ],
    },
    {
      id: "section-payments",
      title: t("menu_section_payments"),
      items: [
        {
          id: "payments-methods",
          label: t("menu_payment_methods"),
          view: "payments",
          icon: IconCreditCard,
        },
        {
          id: "payments-history",
          label: t("menu_payment_history"),
          view: "paymentsHistory",
          icon: IconReceipt,
        },
      ],
    },
    {
      id: "section-preferences",
      title: t("menu_section_preferences"),
      items: [
        {
          id: "preferences-settings",
          label: t("menu_settings"),
          view: "settings",
          icon: IconSettings,
        },
        {
          id: "preferences-notifications",
          label: t("menu_notifications"),
          view: "notifications",
          icon: IconBell,
        },
        {
          id: "preferences-language",
          label: t("menu_language"),
          view: "language",
          icon: IconGlobe,
        },
      ],
    },
    {
      id: "section-security",
      title: t("menu_section_security"),
      items: [
        {
          id: "security-main",
          label: t("menu_security"),
          view: "security",
          icon: IconLock,
        },
        {
          id: "security-privacy",
          label: t("menu_privacy"),
          view: "privacy",
          icon: IconShield,
        },
        {
          id: "security-terms",
          label: t("menu_terms"),
          view: "terms",
          icon: IconFileText,
        },
      ],
    },
  ];

  const renderMenu = () => {
    return (
      <div className="md-profile-menu">
        {menuSections.map((section) => (
          <div key={section.id} className="md-profile-menu-section">
            <div className="md-profile-menu-title">{section.title}</div>
            <div className="md-profile-menu-list">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="md-profile-menu-item"
                    onClick={() => handleOpenView(item.view)}
                  >
                    <div className="md-profile-menu-left">
                      <span className="md-profile-menu-icon">
                        {ItemIcon ? <ItemIcon /> : null}
                      </span>
                      <span className="md-profile-menu-label">
                        {item.label}
                      </span>
                    </div>
                    <span className="md-profile-menu-chevron">›</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="md-profile-menu-section">
          <div className="md-profile-menu-list">
            <button
              type="button"
              className="md-profile-menu-item md-profile-menu-item-danger"
              onClick={handleLogout}
            >
              <div className="md-profile-menu-left">
                <span className="md-profile-menu-icon">
                  <IconLogout />
                </span>
                <span className="md-profile-menu-label">{t("menu_logout")}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderViewTitle = () => {
    if (activeView === "account") return t("menu_my_account");
    if (activeView === "favorites") return t("menu_favorites");
    if (activeView === "trips") return t("menu_my_trips");
    if (activeView === "payments") return t("menu_payment_methods");
    if (activeView === "paymentsHistory") return t("menu_payment_history");
    if (activeView === "settings") return t("menu_settings");
    if (activeView === "notifications") return t("menu_notifications");
    if (activeView === "language") return t("menu_language");
    if (activeView === "security") return t("menu_security");
    if (activeView === "privacy") return t("menu_privacy");
    if (activeView === "terms") return t("menu_terms");
    return "";
  };

  const renderViewContent = () => {
    if (activeView === "account") {
      return (
        <form
          onSubmit={handleProfileSubmit}
          className="md-profile-section-card"
        >
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">{t("profile_menu_personal_data")}</div>
              <div className="md-profile-section-subtitle">
                {t("personal_data_subtitle")}
              </div>
            </div>
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="profile-name">
              {t("personal_data_name_label")}
            </label>
            <textarea
              id="profile-name"
              className={
                profileErrors.name
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((prev) => {
                  const nextValue = event.target.value;
                  setProfileErrors((prevErrors) => ({
                    ...prevErrors,
                    name: nextValue.trim()
                      ? ""
                      : "Informe seu nome completo.",
                  }));
                  return {
                    ...prev,
                    name: nextValue,
                  };
                })
              }
              rows={2}
            />
            {profileErrors.name && (
              <div className="md-field-error">{profileErrors.name}</div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="profile-email">
              {t("personal_data_email_label")}
            </label>
            <input
              id="profile-email"
              className={
                profileErrors.email
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="email"
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((prev) => {
                  const nextValue = event.target.value;
                  setProfileErrors((prevErrors) => ({
                    ...prevErrors,
                    email: isValidEmail(nextValue)
                      ? ""
                      : "Email inválido.",
                  }));
                  return {
                    ...prev,
                    email: nextValue,
                  };
                })
              }
            />
            {profileErrors.email && (
              <div className="md-field-error">{profileErrors.email}</div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="profile-phone">
              {t("personal_data_phone_label")}
            </label>
            <input
              id="profile-phone"
              className={
                profileErrors.phone
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="tel"
              value={profileForm.phone}
              onChange={(event) => {
                const nextValue = formatPhone(event.target.value);
                setProfileForm((prev) => ({
                  ...prev,
                  phone: nextValue,
                }));
              }}
            />
            {profileErrors.phone && (
              <div className="md-field-error">{profileErrors.phone}</div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="profile-document">
              {t("personal_data_cpf_label")}
            </label>
            <input
              id="profile-document"
              className={
                profileErrors.documentId
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              type="text"
              value={profileForm.documentId}
              onChange={(event) => {
                const nextValue = formatCpf(event.target.value);
                setProfileForm((prev) => ({
                  ...prev,
                  documentId: nextValue,
                }));
              }}
              placeholder="000.000.000-00"
            />
            {profileErrors.documentId && (
              <div className="md-field-error">{profileErrors.documentId}</div>
            )}
          </div>
          <div className="md-profile-section-footer">
            <button type="submit" className="md-primary-button">
              {t("personal_data_save_button")}
            </button>
            <button
              type="button"
              className="md-details-secondary md-profile-delete-btn"
              onClick={handleDeleteAccountClick}
            >
              {t("personal_data_delete_account")}
            </button>
          </div>
        </form>
      );
    }

    if (activeView === "favorites") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">Favoritos</div>
              <div className="md-profile-section-subtitle">
                Acesse seus lugares salvos pela aba Minhas viagens.
              </div>
            </div>
          </div>
          <div className="md-profile-section-body">
            <div className="md-profile-meta">
              <span>{favoritesCount} favoritos salvos</span>
            </div>
            <button
              type="button"
              className="md-primary-button"
              onClick={() => navigate("/viagens")}
            >
              Ver favoritos em Minhas viagens
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "trips") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">Minhas viagens</div>
              <div className="md-profile-section-subtitle">
                Consulte detalhes e status das suas reservas confirmadas.
              </div>
            </div>
          </div>
          <div className="md-profile-section-body">
            <div className="md-profile-meta">
              <span>{reservationsCount} viagens registradas</span>
            </div>
            <button
              type="button"
              className="md-primary-button"
              onClick={() => navigate("/viagens")}
            >
              Abrir Minhas viagens
            </button>
          </div>
        </div>
      );
    }

    if (activeView === "payments") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">
                Formas de pagamento
              </div>
              <div className="md-profile-section-subtitle">
                Gerencie os cartões usados com mais frequência.
              </div>
            </div>
          </div>
          <div className="md-profile-body">
            {savedCards.length > 0 ? (
              <div className="md-profile-list">
                {savedCards.map((card) => (
                  <div key={card.id} className="md-profile-payment-card">
                    <div className="md-profile-payment-card-left">
                      <div className="md-profile-payment-card-icon">
                        <IconCreditCard />
                      </div>
                      <div className="md-profile-payment-card-info">
                        <span className="md-profile-payment-card-label">{card.label}</span>
                        <span className="md-profile-payment-card-status">Cartão verificado</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="md-profile-payment-card-remove"
                      onClick={() => handleRemoveCard(card.id)}
                      title="Remover cartão"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="md-profile-empty-state">
                <div className="md-profile-empty-icon">
                  <IconCreditCard width={32} height={32} />
                </div>
                <p>Nenhuma forma de pagamento cadastrada.</p>
              </div>
            )}
            <div className="md-profile-section-footer">
              <button
                type="button"
                className="md-primary-button md-profile-add-btn"
                onClick={() => setActiveView("addCard")}
              >
                Adicionar novo cartão
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === "addCard") {
      return (
        <form onSubmit={handleAddCard} className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">Adicionar cartão</div>
              <div className="md-profile-section-subtitle">
                Preencha os dados do cartão de crédito.
              </div>
            </div>
          </div>
          <div className="md-field-group">
            <label className="md-field-label">Nome no cartão</label>
            <input
              type="text"
              className="md-field-input"
              value={cardForm.holderName}
              onChange={(e) =>
                setCardForm((p) => ({ ...p, holderName: e.target.value }))
              }
              placeholder="Como impresso no cartão"
            />
          </div>
          <div className="md-field-group">
            <label className="md-field-label">Número do cartão</label>
            <div className="md-input-with-icon">
              <span className="md-input-icon">
                <IconCreditCard width={16} height={16} />
              </span>
              <input
                type="text"
                className="md-field-input md-input-pl"
                value={cardForm.number}
                onChange={(e) =>
                  setCardForm((p) => ({
                    ...p,
                    number: formatCardNumber(e.target.value),
                  }))
                }
                placeholder="0000 0000 0000 0000"
                maxLength={23}
              />
            </div>
          </div>
          <div className="md-row-2">
            <div className="md-field-group">
              <label className="md-field-label">Validade</label>
              <input
                type="text"
                className="md-field-input"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm((p) => ({
                    ...p,
                    expiry: formatExpiry(e.target.value),
                  }))
                }
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>
            <div className="md-field-group">
              <label className="md-field-label">CVV</label>
              <input
                type="text"
                className="md-field-input"
                value={cardForm.cvv}
                onChange={(e) =>
                  setCardForm((p) => ({
                    ...p,
                    cvv: onlyDigits(e.target.value).slice(0, 4),
                  }))
                }
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
          {cardFormError && (
            <div className="md-field-error">{cardFormError}</div>
          )}
          <div className="md-profile-section-footer">
            <button type="submit" className="md-primary-button">
              Salvar cartão
            </button>
            <button
              type="button"
              className="md-details-secondary"
              onClick={() => setActiveView("payments")}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (activeView === "paymentsHistory") {
      const getServiceIcon = (type) => {
        switch (type) {
          case "voo":
            return <IconGlobe width={18} height={18} />;
          case "hotel":
            return <IconHome width={18} height={18} />;
          case "onibus":
            return <IconBriefcase width={18} height={18} />;
          default:
            return <IconMapPin width={18} height={18} />;
        }
      };

      const getServiceLabel = (type) => {
        switch (type) {
          case "voo":
            return "Voo";
          case "hotel":
            return "Hotel";
          case "pacote":
            return "Pacote";
          case "passeio":
            return "Passeio";
          case "onibus":
            return "Ônibus";
          default:
            return "Destino";
        }
      };

      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">
                Histórico de pagamentos
              </div>
              <div className="md-profile-section-subtitle">
                Consulte suas cobranças e recibos de viagens confirmadas.
              </div>
            </div>
          </div>
          <div className="md-profile-section-body">
            {reservations.length > 0 ? (
              <div className="md-profile-payment-history">
                {reservations.map((res) => (
                  <div key={res.id} className="md-profile-history-item">
                    <div className="md-profile-history-icon">
                      {getServiceIcon(res.serviceType)}
                    </div>
                    <div className="md-profile-history-info">
                      <div className="md-profile-history-title">
                        {res.destinationName}
                      </div>
                      <div className="md-profile-history-meta">
                        {getServiceLabel(res.serviceType)} • {res.dates}
                      </div>
                      <div className="md-profile-history-method">
                        Pago via{" "}
                        {res.paymentMethod === "credit" ? "Cartão" : "Pix"}
                      </div>
                    </div>
                    <div className="md-profile-history-amount">
                      <div className="md-profile-history-price">{res.price}</div>
                      <div className="md-profile-history-status">Confirmado</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="md-profile-empty-state">
                <div className="md-profile-empty-icon">
                  <IconReceipt width={32} height={32} />
                </div>
                <p>Nenhum pagamento encontrado.</p>
                <button
                  type="button"
                  className="md-details-secondary"
                  onClick={() => navigate("/")}
                  style={{ marginTop: 8 }}
                >
                  Explorar destinos
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === "settings") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">{t("settings_title")}</div>
              <div className="md-profile-section-subtitle">
                {t("settings_subtitle")}
              </div>
            </div>
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="settings-language">
              {t("settings_language")}
            </label>
            <CustomSelect
              id="settings-language"
              value={settingsForm.language}
              options={[
                { value: "pt", label: t("lang_pt") },
                { value: "en", label: t("lang_en") },
              ]}
              onChange={(event) =>
                handleSettingsChange("language", event.target.value)
              }
            />
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="settings-currency">
              {t("settings_currency")}
            </label>
            <CustomSelect
              id="settings-currency"
              value={settingsForm.currency}
              options={[
                { value: "BRL - Real brasileiro", label: "BRL - Real brasileiro" },
                { value: "USD - Dólar americano", label: "USD - Dólar americano" },
                { value: "EUR - Euro", label: "EUR - Euro" },
              ]}
              onChange={(event) =>
                handleSettingsChange("currency", event.target.value)
              }
            />
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="settings-theme">
              {t("settings_theme")}
            </label>
            <CustomSelect
              id="settings-theme"
              value={settingsForm.theme}
              options={[
                { value: "Claro", label: "Claro" },
                { value: "Escuro", label: "Escuro" },
                { value: "Sistema", label: "Sistema" },
              ]}
              onChange={(event) =>
                handleSettingsChange("theme", event.target.value)
              }
            />
          </div>
        </div>
      );
    }

    if (activeView === "notifications") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">
                {t("notifications_title")}
              </div>
              <div className="md-profile-section-subtitle">
                {t("notifications_subtitle")}
              </div>
            </div>
          </div>
          <div className="md-field-group">
                <div className="md-toggle-list">
                  <label className="md-toggle-row">
                    <div className="md-toggle-icon">
                      <IconEmail />
                    </div>
                    <span className="md-toggle-content">{t("notifications_email")}</span>
                    <input
                      type="checkbox"
                      className="md-toggle-input"
                      checked={settingsForm.notifications.email}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            email: e.target.checked,
                          },
                        }))
                      }
                    />
                    <div className="md-toggle-slider"></div>
                  </label>
                  <label className="md-toggle-row">
                    <div className="md-toggle-icon">
                      <IconMessage />
                    </div>
                    <span className="md-toggle-content">{t("notifications_sms")}</span>
                    <input
                      type="checkbox"
                      className="md-toggle-input"
                      checked={settingsForm.notifications.sms}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            sms: e.target.checked,
                          },
                        }))
                      }
                    />
                    <div className="md-toggle-slider"></div>
                  </label>
                  <label className="md-toggle-row">
                    <div className="md-toggle-icon">
                      <IconBell />
                    </div>
                    <span className="md-toggle-content">{t("notifications_push")}</span>
                    <input
                      type="checkbox"
                      className="md-toggle-input"
                      checked={settingsForm.notifications.push}
                      onChange={(e) =>
                        setSettingsForm((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            push: e.target.checked,
                          },
                        }))
                      }
                    />
                    <div className="md-toggle-slider"></div>
                  </label>
                </div>
          </div>
        </div>
      );
    }

    if (activeView === "language") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">{t("settings_language")}</div>
              <div className="md-profile-section-subtitle">
                {t("language_subtitle")}
              </div>
            </div>
          </div>
          <div className="md-field-group">
            <CustomSelect
              value={settingsForm.language}
              options={[
                { value: "pt", label: t("lang_pt") },
                { value: "en", label: t("lang_en") },
              ]}
              onChange={(event) =>
                handleSettingsChange("language", event.target.value)
              }
            />
          </div>
        </div>
      );
    }

    if (activeView === "security") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">{t("security_title")}</div>
              <div className="md-profile-section-subtitle">
                {t("security_subtitle")}
              </div>
            </div>
          </div>
          <form onSubmit={handleSecuritySubmit}>
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="security-current">
                {t("security_current_password")}
              </label>
              <div className="md-input-with-icon">
                <span className="md-input-icon">
                  <IconLock width={16} height={16} />
                </span>
                <input
                  id="security-current"
                  className="md-field-input md-input-pl"
                  type="password"
                  value={securityState.currentPassword}
                  onChange={(event) =>
                    setSecurityState((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="security-new">
                {t("security_new_password")}
              </label>
              <div className="md-input-with-icon">
                <span className="md-input-icon">
                  <IconLock width={16} height={16} />
                </span>
                <input
                  id="security-new"
                  className="md-field-input md-input-pl"
                  type="password"
                  value={securityState.newPassword}
                  onChange={(event) =>
                    setSecurityState((prev) => ({
                      ...prev,
                      newPassword: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="security-confirm">
                {t("security_confirm_password")}
              </label>
              <div className="md-input-with-icon">
                <span className="md-input-icon">
                  <IconCheckCircle width={16} height={16} />
                </span>
                <input
                  id="security-confirm"
                  className="md-field-input md-input-pl"
                  type="password"
                  value={securityState.confirmPassword}
                  onChange={(event) =>
                    setSecurityState((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {securityState.error && (
              <div className="md-field-error">{securityState.error}</div>
            )}
            {securityState.success && (
              <div className="md-field-success">
                {securityState.success}
              </div>
            )}
            <div className="md-profile-section-footer">
              <button type="submit" className="md-primary-button">
                {t("security_button_update")}
              </button>
            </div>
          </form>
          <div className="md-security-sessions">
            <div className="md-security-sessions-title">{t("security_sessions_title")}</div>
            <div className="md-security-session-list">
              <div className="md-security-session-row">
                <div className="md-security-session-icon">
                  <IconMonitor width={20} height={20} />
                </div>
                <div className="md-security-session-info">
                  <div className="md-security-session-name">
                    {t("security_device_current")}
                  </div>
                  <div className="md-security-session-meta">
                    São Paulo · Agora
                  </div>
                </div>
                <span className="md-security-session-badge">{t("security_session_current")}</span>
              </div>
              <div className="md-security-session-row">
                <div className="md-security-session-icon">
                  <IconSmartphone width={20} height={20} />
                </div>
                <div className="md-security-session-info">
                  <div className="md-security-session-name">iPhone 13</div>
                  <div className="md-security-session-meta">
                    Rio de Janeiro · ontem
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === "privacy" || activeView === "terms") {
      return (
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">
                {activeView === "privacy"
                  ? t("menu_privacy")
                  : t("menu_terms")}
              </div>
              <div className="md-profile-section-subtitle">
                {t("legal_subtitle")}
              </div>
            </div>
          </div>
          <div className="md-profile-section-body">
            <div className="md-profile-meta">
              <span>
                {t("legal_content")}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="md-section">
      <div className="md-profile-container">
        <div className="md-profile-sidebar">
          <div className="md-profile-header">
            <ProfileAvatar user={user} initials={initials} />
            <div className="md-profile-info">
              <h2 className="md-profile-name">
                {user?.name || "Visitante"}
              </h2>
              <p className="md-profile-email">{user?.email}</p>
            </div>
          </div>
          <span className="md-mobile-only">
            {activeView === "menu" ? null : (
              <button
                type="button"
                className="md-profile-back-button"
                onClick={handleBackToMenu}
                style={{ marginBottom: 16 }}
              >
                <IconArrowLeft width={20} height={20} /> Voltar
              </button>
            )}
          </span>
          <span className="md-desktop-only">
            {renderMenu()}
          </span>
        </div>
        <div
          key={activeView}
          className="md-profile-view md-profile-view-enter"
        >
          {activeView === "menu" ? (
            renderMenu()
          ) : (
            <div className="md-profile-view-inner">
              <div className="md-profile-view-header">
                <button
                  type="button"
                  className="md-profile-back-button"
                  onClick={handleBackToMenu}
                  aria-label="Voltar ao menu"
                >
                  <IconArrowLeft width={20} height={20} />
                </button>
                <div className="md-profile-view-title">
                  {renderViewTitle()}
                </div>
              </div>
              {renderViewContent()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileScreen;
