import React from "react";

const services = [
  { id: "passeios", label: "Passeios" },
  { id: "voos", label: "Voos" },
  { id: "hoteis", label: "Hotéis" },
  { id: "pacotes", label: "Pacotes" },
  { id: "onibus", label: "Ônibus" },
];

function ServiceTabs({ activeService, onChange }) {
  return (
    <div className="md-tabs-wrapper">
      <div
        className="md-tabs"
        role="tablist"
        aria-label="Selecione o tipo de serviço"
      >
        {services.map((service) => {
          const isActive = service.id === activeService;
          return (
            <button
              key={service.id}
              type="button"
              className={
                isActive
                  ? "md-tab md-tab-active"
                  : "md-tab"
              }
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(service.id)}
            >
              {service.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceTabs;
