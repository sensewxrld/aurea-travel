import React from "react";
import { IconHome, IconSearch, IconTrips, IconProfile } from "./Icons.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

function BottomTabBar({ activeTab, onChange, isHidden }) {
  const { t } = useLanguage();

  const tabs = [
    { id: "home", label: t("tab_home"), icon: IconHome },
    { id: "buscar", label: t("tab_search"), icon: IconSearch },
    { id: "viagens", label: t("tab_trips"), icon: IconTrips },
    { id: "perfil", label: t("tab_profile"), icon: IconProfile },
  ];

  return (
    <nav 
      className={`md-bottom-tab-bar ${isHidden ? "md-bottom-tab-bar-hidden" : ""}`} 
      aria-label="Navegação principal"
    >
      <div className="md-bottom-tab-inner">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={
                isActive
                  ? "md-bottom-tab-item md-bottom-tab-item-active"
                  : "md-bottom-tab-item"
              }
              onClick={() => onChange(tab.id)}
            >
              <span
                className={
                  isActive
                    ? "md-bottom-tab-icon md-bottom-tab-icon-active"
                    : "md-bottom-tab-icon"
                }
                aria-hidden="true"
              >
                <IconComponent />
              </span>
              <span className="md-bottom-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomTabBar;
