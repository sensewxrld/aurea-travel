import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconTrips,
  IconClose,
  IconBriefcase,
  IconUser,
  IconProfile,
  IconShield,
  IconHeart,
} from "../components/Icons.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import {
  flightsMock,
  hotelsMock,
  packagesMock,
  busesMock,
} from "./SearchScreen.jsx";

function TripsScreen({ favorites, reservations, onToggleFavorite, onSheetStateChange }) {
  const navigate = useNavigate();
  const hasFavorites = favorites && favorites.length > 0;
  const hasReservations = reservations && reservations.length > 0;
  const [activeTrip, setActiveTrip] = useState(null);

  const handleExplore = () => {
    navigate("/buscar");
  };

  const handleOpenTrip = (trip) => {
    setActiveTrip(trip || null);
    if (onSheetStateChange) onSheetStateChange(true);
  };

  const handleCloseSheet = () => {
    setActiveTrip(null);
    if (onSheetStateChange) onSheetStateChange(false);
  };

  const formatPeople = (people) => {
    if (!people) return "Não informado";
    if (typeof people === "string") return people;
    const adults = people.adults || 0;
    const children = people.children || 0;
    if (adults === 0 && children === 0) return "Não informado";
    
    const parts = [];
    if (adults > 0) parts.push(`${adults} adulto(s)`);
    if (children > 0) parts.push(`${children} criança(s)`);
    return parts.join(", ");
  };

  const getServiceLabel = (serviceType) => {
    if (serviceType === "voo") return "Voo";
    if (serviceType === "hotel") return "Hotel";
    if (serviceType === "pacote") return "Pacote";
    if (serviceType === "onibus") return "Ônibus";
    if (serviceType === "destino") return "Destino";
    return "Viagem";
  };

  const parseTripDate = (reservation) => {
    if (!reservation) return null;
    if (reservation.date_start && typeof reservation.date_start === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(reservation.date_start)) {
        const [year, month, day] = reservation.date_start.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
    if (reservation.dates && typeof reservation.dates === "string") {
      const parts = reservation.dates.split("→").map((part) => part.trim());
      const target = parts[0] || reservation.dates;
      const match = target.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (match) {
        const [, day, month, year] = match;
        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );
      }
    }
    return null;
  };

  const sortedReservations = hasReservations
    ? [...reservations].sort((a, b) => {
        const dateA = parseTripDate(a);
        const dateB = parseTripDate(b);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      })
    : [];

  const nextTrip = sortedReservations.length > 0 ? sortedReservations[0] : null;
  const otherTrips =
    sortedReservations.length > 1 ? sortedReservations.slice(1) : [];

  const getSupplierInfo = (trip) => {
    if (!trip || !trip.serviceType) return null;

    if (trip.serviceType === "voo") {
      const match =
        flightsMock.find((flight) => {
          const name = `${flight.originCity} → ${flight.destinationCity}`;
          return (
            name === trip.destinationName && flight.price === trip.price
          );
        }) || null;
      if (match) {
        return `${match.airline} (${match.airlineCode})`;
      }
      return "Companhia aérea";
    }

    if (trip.serviceType === "onibus") {
      const match =
        busesMock.find((bus) => {
          const name = `${bus.originCity} → ${bus.destinationCity}`;
          return name === trip.destinationName && bus.price === trip.price;
        }) || null;
      if (match) {
        return `${match.company} (${match.companyCode})`;
      }
      return "Empresa de ônibus";
    }

    if (trip.serviceType === "hotel") {
      const match =
        hotelsMock.find((hotel) =>
          trip.destinationName &&
          trip.destinationName.toLowerCase().includes(
            hotel.name.toLowerCase()
          )
        ) || null;
      if (match) {
        return `${match.name} · ${match.city}`;
      }
      return "Hotel reservado";
    }

    if (trip.serviceType === "pacote") {
      const match =
        packagesMock.find(
          (pkg) =>
            pkg.title === trip.destinationName || trip.destinationName === pkg.city
        ) || null;
      if (match) {
        return `${match.title} · ${match.city}`;
      }
      return "Pacote de viagem";
    }

    if (trip.serviceType === "destino") {
      return trip.destinationName || "Destino salvo";
    }

    return null;
  };

  const activeTripSupplier = useMemo(
    () => getSupplierInfo(activeTrip),
    [activeTrip]
  );

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Minhas viagens</h1>
          <p className="md-section-subtitle">
            Acompanhe reservas confirmadas e lugares que você salvou para depois.
          </p>
        </div>
      </div>
      {hasReservations && nextTrip && (
        <div className="md-trip-group">
          <div className="md-trip-group-title">Próxima viagem</div>
          <div className="md-trip-list">
            <article
              key={nextTrip.id}
              className="md-trip-card"
              onClick={() => handleOpenTrip(nextTrip)}
            >
              <div className="md-trip-header">
                <div className="md-trip-destination">
                  {nextTrip.destinationName}
                </div>
                <div className="md-trip-header-right">
                  <span className="md-trip-chip">
                    {getServiceLabel(nextTrip.serviceType)}
                  </span>
                  <div className="md-trip-status">Confirmada</div>
                </div>
              </div>
              <div className="md-trip-meta">
                <span>{nextTrip.dates}</span>
                <span>·</span>
                <span>{formatPeople(nextTrip.people)}</span>
              </div>
              {nextTrip.price && (
                <div className="md-trip-price">{nextTrip.price}</div>
              )}
            </article>
          </div>
        </div>
      )}
      {otherTrips.length > 0 && (
        <div className="md-trip-group">
          <div className="md-trip-group-title">Outras viagens</div>
          <div className="md-trip-list">
            {otherTrips.map((trip) => (
              <article
                key={trip.id}
                className="md-trip-card"
                onClick={() => handleOpenTrip(trip)}
              >
                <div className="md-trip-header">
                  <div className="md-trip-destination">
                    {trip.destinationName}
                  </div>
                  <div className="md-trip-header-right">
                    <span className="md-trip-chip">
                      {getServiceLabel(trip.serviceType)}
                    </span>
                    <div className="md-trip-status">Confirmada</div>
                  </div>
                </div>
                <div className="md-trip-meta">
                  <span>{trip.dates}</span>
                  <span>·</span>
                  <span>{formatPeople(trip.people)}</span>
                </div>
                {trip.price && (
                  <div className="md-trip-price">{trip.price}</div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
      <div className="md-section-header">
        <div>
          <h2 className="md-section-title">Favoritos</h2>
          <p className="md-section-subtitle">
            Lugares que chamaram sua atenção e podem virar a próxima viagem.
          </p>
        </div>
      </div>
      {hasFavorites ? (
        <div className="md-search-results">
          {favorites.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isFavorite
              onToggleFavorite={() => onToggleFavorite(destination)}
            />
          ))}
        </div>
      ) : (
        <div className="md-empty-card">
          <div className="md-empty-icon">
            <IconTrips />
          </div>
          <h2 className="md-empty-title">Nenhum favorito por enquanto</h2>
          <p className="md-empty-subtitle">
            Salve destinos e pacotes para decidir com calma.
          </p>
          <button
            type="button"
            className="md-empty-button"
            onClick={handleExplore}
          >
            Buscar destinos
          </button>
        </div>
      )}

      {activeTrip && (
        <>
          <div
            className="md-trip-sheet-backdrop"
            onClick={handleCloseSheet}
          />
          <div className="md-trip-sheet">
            <div className="md-trip-sheet-inner">
              <button className="md-trip-sheet-close" onClick={handleCloseSheet}>
                <IconClose />
              </button>
              <div className="md-trip-sheet-handle" />
              <div className="md-trip-sheet-header">
                <div style={{ paddingRight: 40 }}>
                  <div className="md-trip-sheet-title">
                    {activeTrip.destinationName}
                  </div>
                  <div className="md-trip-sheet-subtitle">
                    {getServiceLabel(activeTrip.serviceType)} ·{" "}
                    {activeTrip.dates || "Datas a definir"}
                  </div>
                </div>
              </div>

              <div className="md-trip-sheet-chip-row">
                <span className="md-trip-sheet-status">Confirmada</span>
                {activeTrip.people && (
                  <span className="md-trip-sheet-chip">
                    {formatPeople(activeTrip.people)}
                  </span>
                )}
                {activeTrip.price && (
                  <span className="md-trip-sheet-chip">
                    Valor total: {activeTrip.price}
                  </span>
                )}
                {activeTripSupplier && (
                  <span className="md-trip-sheet-chip">
                    Fornecedor: {activeTripSupplier}
                  </span>
                )}
              </div>

              <div className="md-trip-sheet-details">
                <div className="md-trip-sheet-detail-row">
                  <div className="md-trip-sheet-detail-icon">
                    <IconBriefcase width={18} height={18} />
                  </div>
                  <div className="md-trip-sheet-detail-text">
                    <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Tipo de serviço</div>
                    {getServiceLabel(activeTrip.serviceType)}
                  </div>
                </div>

                {activeTrip.dates && (
                  <div className="md-trip-sheet-detail-row">
                    <div className="md-trip-sheet-detail-icon">
                      <IconTrips width={18} height={18} />
                    </div>
                    <div className="md-trip-sheet-detail-text">
                      <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Datas</div>
                      {activeTrip.dates}
                    </div>
                  </div>
                )}

                {activeTrip.people && (
                  <div className="md-trip-sheet-detail-row">
                    <div className="md-trip-sheet-detail-icon">
                      <IconUser width={18} height={18} />
                    </div>
                    <div className="md-trip-sheet-detail-text">
                      <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Viajantes</div>
                      {formatPeople(activeTrip.people)}
                    </div>
                  </div>
                )}

                {activeTrip.customerName && (
                  <div className="md-trip-sheet-detail-row">
                    <div className="md-trip-sheet-detail-icon">
                      <IconProfile width={18} height={18} />
                    </div>
                    <div className="md-trip-sheet-detail-text">
                      <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Viajante principal</div>
                      {activeTrip.customerName}
                    </div>
                  </div>
                )}

                <div className="md-trip-sheet-detail-row">
                  <div className="md-trip-sheet-detail-icon">
                    <IconShield width={18} height={18} />
                  </div>
                  <div className="md-trip-sheet-detail-text">
                    <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Status da viagem</div>
                    Confirmada
                  </div>
                </div>

                <div className="md-trip-sheet-detail-row">
                  <div className="md-trip-sheet-detail-icon">
                    <IconHeart width={18} height={18} />
                  </div>
                  <div className="md-trip-sheet-detail-text">
                    <div style={{ fontSize: 11, color: "var(--md-color-muted)", marginBottom: 2 }}>Avaliação</div>
                    Avaliação ainda não enviada
                  </div>
                </div>
              </div>

              <div className="md-trip-sheet-actions">
                <button
                  type="button"
                  className="md-trip-sheet-btn md-trip-sheet-btn-secondary"
                  onClick={() => {
                    navigate("/compra-confirmada", {
                      state: { reservation: activeTrip },
                    });
                    handleCloseSheet();
                  }}
                >
                  Ver comprovante
                </button>
                <button
                  type="button"
                  className="md-trip-sheet-btn md-trip-sheet-btn-secondary"
                  onClick={() => {
                    navigate("/avaliar-viagem");
                    handleCloseSheet();
                  }}
                >
                  Avaliar
                </button>
                <button
                  type="button"
                  className="md-trip-sheet-btn md-trip-sheet-btn-primary"
                  style={{ gridColumn: "span 2" }}
                  onClick={() => {
                    navigate("/perfil");
                    handleCloseSheet();
                  }}
                >
                  Suporte
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default TripsScreen;
