import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconCheckCircle } from "../components/Icons.jsx";

function PurchaseConfirmationScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const reservation = location.state?.reservation || null;

  const handleGoToTrips = () => {
    navigate("/viagens");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Compra confirmada</h1>
          <p className="md-section-subtitle">
            Sua reserva foi concluída com sucesso. Agora é só se preparar para embarcar.
          </p>
        </div>
      </div>
      <div className="md-status-card">
        <div className="md-status-header">
          <div className="md-status-icon">
            <IconCheckCircle />
          </div>
          <div>
            <div className="md-status-title">Tudo certo com a sua viagem</div>
            <div className="md-status-subtitle">
              Enviamos um resumo da reserva para o seu e-mail cadastrado.
            </div>
          </div>
        </div>
        {reservation && (
          <div className="md-status-details">
            <div className="md-status-detail-row">
              <span className="md-status-detail-label">Destino</span>
              <span className="md-status-detail-value">
                {reservation.destinationName}
              </span>
            </div>
            {reservation.id && (
              <div className="md-status-detail-row">
                <span className="md-status-detail-label">
                  Número da reserva
                </span>
                <span className="md-status-detail-value">
                  {String(reservation.id)}
                </span>
              </div>
            )}
            {reservation.dates && (
              <div className="md-status-detail-row">
                <span className="md-status-detail-label">Datas</span>
                <span className="md-status-detail-value">
                  {reservation.dates}
                </span>
              </div>
            )}
            {reservation.people && (
              <div className="md-status-detail-row">
                <span className="md-status-detail-label">Viajantes</span>
                <span className="md-status-detail-value">
                  {(() => {
                    const people = reservation.people;
                    if (
                      typeof people === "object" &&
                      people !== null &&
                      (typeof people.adults === "number" ||
                        typeof people.children === "number")
                    ) {
                      const adults = people.adults ?? 0;
                      const children = people.children ?? 0;
                      const parts = [];
                      if (adults > 0) {
                        parts.push(
                          `${adults} ${adults === 1 ? "adulto" : "adultos"}`
                        );
                      }
                      if (children > 0) {
                        parts.push(
                          `${children} ${
                            children === 1 ? "criança" : "crianças"
                          }`
                        );
                      }
                      return parts.join(", ");
                    }
                    return reservation.people;
                  })()}
                </span>
              </div>
            )}
            {reservation.price && (
              <div className="md-status-detail-row">
                <span className="md-status-detail-label">Valor total</span>
                <span className="md-status-detail-value">
                  {reservation.price}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="md-status-actions">
          <button
            type="button"
            className="md-primary-button md-auth-btn"
            style={{ flex: 1 }}
            onClick={handleGoToTrips}
          >
            Ver minha viagem
          </button>
          <button
            type="button"
            className="md-secondary-button md-auth-btn"
            style={{ flex: 1 }}
            onClick={handleGoHome}
          >
            Voltar para o início
          </button>
        </div>
      </div>
    </section>
  );
}

export default PurchaseConfirmationScreen;
