import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
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
  user,
  favoritesCount,
  reservationsCount,
  reservations = [],
  onLogout,
  onUpdateUser,
  onDeleteAccount,
}) {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const isLoggedIn = !!user;
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

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    if (!onUpdateUser || !user) return;
    const nextErrors = {
      name: "",
      email: "",
      phone: "",
      documentId: "",
    };
    const trimmedName = profileForm.name.trim();
    const trimmedEmail = profileForm.email.trim();
    const phoneDigits = onlyDigits(profileForm.phone);
    const documentDigits = onlyDigits(profileForm.documentId);
    let hasError = false;

    if (!trimmedName) {
      nextErrors.name = "Informe seu nome completo.";
      hasError = true;
    }

    if (!trimmedEmail) {
      nextErrors.email = "Informe seu email.";
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = "Digite um email válido.";
      hasError = true;
    }

    if (phoneDigits && !isValidPhoneDigits(phoneDigits)) {
      nextErrors.phone = "Digite um telefone com DDD (10 ou 11 dígitos).";
      hasError = true;
    }

    if (documentDigits && !isValidCpfDigits(documentDigits)) {
      nextErrors.documentId = "Digite um CPF válido (11 dígitos).";
      hasError = true;
    }

    setProfileErrors(nextErrors);

    if (hasError) {
      return;
    }

    onUpdateUser({
      name: trimmedName,
      email: trimmedEmail,
      phone: profileForm.phone,
      documentId: profileForm.documentId,
    });
  };

  useEffect(() => {
    setSettingsForm((prev) => ({
      ...prev,
      language: language,
    }));
  }, [language]);

  const handleSettingsChange = (field, value) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "language") {
      changeLanguage(value);
    }

    if (!onUpdateUser || !user) return;
    if (field === "notifications") {
      onUpdateUser({
        notifications: value,
      });
    } else {
      onUpdateUser({
        [field]: value,
      });
    }
  };

  const handleNotificationToggle = (key) => {
    setSettingsForm((prev) => {
      const nextNotifications = {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      };
      if (onUpdateUser && user) {
        onUpdateUser({
          notifications: nextNotifications,
        });
      }
      return {
        ...prev,
        notifications: nextNotifications,
      };
    });
  };

  const handleAddCard = () => {
    setCardFormError("");
    setCardForm((prev) => ({
      holderName: user?.name || prev.holderName || "",
      number: "",
      expiry: "",
      cvv: "",
    }));
    setActiveView("addCard");
  };

  const handleRemoveCard = (cardId) => {
    setSavedCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleCardFormChange = (field, value) => {
    if (field === "number") {
      setCardForm((prev) => ({
        ...prev,
        number: formatCardNumber(value),
      }));
      return;
    }
    if (field === "expiry") {
      setCardForm((prev) => ({
        ...prev,
        expiry: formatExpiry(value),
      }));
      return;
    }
    if (field === "cvv") {
      setCardForm((prev) => ({
        ...prev,
        cvv: onlyDigits(value).slice(0, 4),
      }));
      return;
    }
    setCardForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardFormSubmit = (event) => {
    event.preventDefault();
    const trimmedName = cardForm.holderName.trim();
    if (!trimmedName) {
      setCardFormError("Informe o nome impresso no cartão.");
      return;
    }
    if (!isValidCardNumber(cardForm.number)) {
      setCardFormError("Digite um número de cartão válido.");
      return;
    }
    if (!isValidExpiry(cardForm.expiry)) {
      setCardFormError("Digite uma validade no formato MM/AA.");
      return;
    }
    if (!/^\d{3,4}$/.test(onlyDigits(cardForm.cvv))) {
      setCardFormError("Digite o código de segurança com 3 ou 4 dígitos.");
      return;
    }

    const digits = onlyDigits(cardForm.number);
    const last4 = digits.slice(-4) || "0000";
    let brand = "Cartão";
    if (digits.startsWith("4")) {
      brand = "Visa";
    } else if (digits.startsWith("5")) {
      brand = "Mastercard";
    }
    const label = `${brand} final ${last4}`;

    setSavedCards((prev) => {
      const nextIndex = prev.length + 1;
      return [...prev, { id: `card-${nextIndex}`, label }];
    });
    setCardFormError("");
    setActiveView("payments");
  };

  const handleSecuritySubmit = (event) => {
    event.preventDefault();
    if (!user || !onUpdateUser) return;
    if (!securityState.newPassword || !securityState.confirmPassword) {
      setSecurityState((prev) => ({
        ...prev,
        error: "Preencha a nova senha e a confirmação.",
        success: "",
      }));
      return;
    }
    if (securityState.newPassword !== securityState.confirmPassword) {
      setSecurityState((prev) => ({
        ...prev,
        error: "As senhas não conferem.",
        success: "",
      }));
      return;
    }
    setSecurityState((prev) => ({
      ...prev,
      error: "",
      success: "Senha atualizada com sucesso.",
    }));
    onUpdateUser({
      password: securityState.newPassword,
    });
  };

  const handleDeleteAccountClick = () => {
    if (!onDeleteAccount) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      onDeleteAccount();
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
              <span className="md-auth-feature-icon">
                <IconBriefcase width={18} height={18} />
              </span>
              <span>Viagens</span>
            </div>
            <div className="md-auth-feature">
              <span className="md-auth-feature-icon">
                <IconHeart width={18} height={18} />
              </span>
              <span>Favoritos</span>
            </div>
            <div className="md-auth-feature">
              <span className="md-auth-feature-icon">
                <IconShield width={18} height={18} />
              </span>
              <span>Segurança</span>
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

  const menuSections = useMemo(() => [
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
  ], [t]);

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
              onClick={onLogout}
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
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((prev) => {
                  const nextValue = event.target.value;
                  const trimmed = nextValue.trim();
                  setProfileErrors((prevErrors) => ({
                    ...prevErrors,
                    email: !trimmed
                      ? "Informe seu email."
                      : !isValidEmail(trimmed)
                      ? "Digite um email válido."
                      : "",
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
              value={profileForm.phone}
              onChange={(event) =>
                setProfileForm((prev) => {
                  const formatted = formatPhone(event.target.value);
                  const digits = onlyDigits(formatted);
                  setProfileErrors((prevErrors) => ({
                    ...prevErrors,
                    phone:
                      digits && !isValidPhoneDigits(digits)
                        ? "Digite um telefone com DDD (10 ou 11 dígitos)."
                        : "",
                  }));
                  return {
                    ...prev,
                    phone: formatted,
                  };
                })
              }
            />
            {profileErrors.phone && (
              <div className="md-field-error">{profileErrors.phone}</div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="profile-document">
              {t("personal_data_document_label")}
            </label>
            <input
              id="profile-document"
              className={
                profileErrors.documentId
                  ? "md-field-input md-field-input-error"
                  : "md-field-input"
              }
              placeholder="CPF (apenas para demonstração)"
              value={profileForm.documentId}
              onChange={(event) =>
                setProfileForm((prev) => {
                  const formatted = formatCpf(event.target.value);
                  const digits = onlyDigits(formatted);
                  setProfileErrors((prevErrors) => ({
                    ...prevErrors,
                    documentId:
                      digits && !isValidCpfDigits(digits)
                        ? "Digite um CPF válido (11 dígitos)."
                        : "",
                  }));
                  return {
                    ...prev,
                    documentId: formatted,
                  };
                })
              }
            />
            {profileErrors.documentId && (
              <div className="md-field-error">{profileErrors.documentId}</div>
            )}
          </div>
          <div className="md-profile-section-footer">
            <button type="submit" className="md-primary-button">
              Salvar alterações
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
                onClick={handleAddCard}
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
        <div className="md-profile-section-card">
          <div className="md-profile-section-header">
            <div>
              <div className="md-profile-section-title">Adicionar cartão</div>
              <div className="md-profile-section-subtitle">
                Informe os dados do cartão de crédito usado com mais frequência.
              </div>
            </div>
          </div>
          <form onSubmit={handleCardFormSubmit}>
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="profile-card-holder">
                Nome impresso no cartão
              </label>
              <input
                id="profile-card-holder"
                className="md-field-input"
                type="text"
                value={cardForm.holderName}
                onChange={(event) =>
                  handleCardFormChange("holderName", event.target.value)
                }
              />
            </div>
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="profile-card-number">
                Número do cartão
              </label>
              <input
                id="profile-card-number"
                className="md-field-input"
                type="text"
                inputMode="numeric"
                value={cardForm.number}
                onChange={(event) =>
                  handleCardFormChange("number", event.target.value)
                }
              />
            </div>
            <div className="md-field-inline">
              <div className="md-field-group">
                <label className="md-field-label" htmlFor="profile-card-expiry">
                  Validade (MM/AA)
                </label>
                <input
                  id="profile-card-expiry"
                  className="md-field-input"
                  type="text"
                  inputMode="numeric"
                  value={cardForm.expiry}
                  onChange={(event) =>
                    handleCardFormChange("expiry", event.target.value)
                  }
                />
              </div>
              <div className="md-field-group">
                <label className="md-field-label" htmlFor="profile-card-cvv">
                  Código de segurança
                </label>
                <input
                  id="profile-card-cvv"
                  className="md-field-input"
                  type="password"
                  inputMode="numeric"
                  value={cardForm.cvv}
                  onChange={(event) =>
                    handleCardFormChange("cvv", event.target.value)
                  }
                />
              </div>
            </div>
            {cardFormError && (
              <div className="md-field-error">{cardFormError}</div>
            )}
            <div className="md-profile-section-footer">
              <button
                type="button"
                className="md-details-secondary"
                onClick={() => {
                  setCardFormError("");
                  setActiveView("payments");
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="md-primary-button">
                Salvar cartão
              </button>
            </div>
          </form>
        </div>
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
                { value: "BRL - Real brasileiro", label: t("curr_brl") },
                { value: "USD - Dólar americano", label: t("curr_usd") },
                { value: "EUR - Euro", label: t("curr_eur") },
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
                { value: "Claro", label: t("theme_light") },
                { value: "Escuro", label: t("theme_dark") },
                { value: "Automático", label: t("theme_auto") },
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
              <div className="md-profile-section-title">{t("notifications_title")}</div>
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
                      checked={settingsForm.notifications.email}
                      onChange={() => handleNotificationToggle("email")}
                    />
                    <div className="md-toggle-switch"></div>
                  </label>
                  <label className="md-toggle-row">
                    <div className="md-toggle-icon">
                      <IconMessage />
                    </div>
                    <span className="md-toggle-content">{t("notifications_sms")}</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.notifications.sms}
                      onChange={() => handleNotificationToggle("sms")}
                    />
                    <div className="md-toggle-switch"></div>
                  </label>
                  <label className="md-toggle-row">
                    <div className="md-toggle-icon">
                      <IconBell />
                    </div>
                    <span className="md-toggle-content">{t("notifications_push")}</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.notifications.push}
                      onChange={() => handleNotificationToggle("push")}
                    />
                    <div className="md-toggle-switch"></div>
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
      <div className="md-profile-card">
        <div className="md-profile-header">
          <ProfileAvatar user={user} initials={initials} />
          <div style={{ flex: 1 }}>
            <div className="md-profile-name-row">
              <div className="md-profile-name">{user.name}</div>
              <button
                type="button"
                className="md-profile-edit-button"
                onClick={() => handleOpenView("account")}
              >
                <span className="md-profile-edit-icon">
                  <IconEdit width={14} height={14} />
                </span>
                <span>{t("profile_edit")}</span>
              </button>
            </div>
            <div className="md-profile-email">{user.email}</div>
            <div className="md-profile-status-row">
              <span className="md-profile-status-dot" />
              <span className="md-profile-status-label">{t("profile_verified")}</span>
            </div>
          </div>
        </div>
        <div className="md-profile-meta">
          <span>
            <IconBriefcase width={16} height={16} style={{ marginRight: 6 }} />
            {reservationsCount} {t("profile_stats_trips")}
          </span>
          <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
          <span>
            <IconHeart width={16} height={16} style={{ marginRight: 6 }} />
            {favoritesCount} {t("profile_stats_favorites")}
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
