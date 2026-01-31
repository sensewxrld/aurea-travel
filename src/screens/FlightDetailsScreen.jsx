import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { flightsMock } from "./SearchScreen.jsx";
import {
  IconPlane,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconStarFull,
  IconCheck,
  IconHeart,
} from "../components/Icons.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

function FlightDetailsScreen({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const flight = flightsMock.find((item) => item.id === id) || flightsMock[0];

  if (!flight) {
    return null;
  }

  const isFavorite = favorites?.some((item) => item.id === flight.id);

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const formatDateForDisplay = (value) => {
    if (!value) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(flight.price, searchPeople.adults, searchPeople.children);
    navigate("/checkout", {
      state: {
        destination: {
          id: `flight-${flight.id}`,
          name: `${flight.originCity} → ${flight.destinationCity}`,
          price: totalPriceInfo.totalFormatted,
          serviceType: "voo",
        },
        searchPeople,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const stopsLabel = flight.isDirect
    ? "Sem escalas"
    : flight.stops === 1
    ? "1 parada"
    : `${flight.stops || 2}+ paradas`;

  const amenities = [
    { icon: <IconCheck />, label: "Bagagem de mão inclusa" },
    { icon: <IconCheck />, label: "Check-in online" },
    { icon: <IconCheck />, label: "Remarcação disponível" },
    { icon: <IconCheck />, label: "Serviço de bordo" },
  ];

  const images = [
    "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1089306/pexels-photo-1089306.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">
            {flight.originCity} → {flight.destinationCity}
          </h1>
          <p className="md-section-subtitle">
            {flight.airline} · {stopsLabel}
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite && onToggleFavorite(flight)}
        >
          <IconHeart fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="md-details-card">
        <div className="md-details-section">
          <div 
            className="md-details-gallery-carousel" 
            ref={galleryRef}
            onScroll={handleScroll}
          >
            {images.map((img, index) => (
              <div key={index} className="md-details-gallery-slide">
                <img src={img} alt={`${flight.airline} - ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="md-details-gallery-dots">
            {images.map((_, index) => (
              <div 
                key={index} 
                className={`md-details-gallery-dot ${index === currentImgIndex ? 'active' : ''}`} 
              />
            ))}
          </div>
        </div>

        <div className="md-details-body">
          <div className="md-details-meta">
            <div className="md-details-rating-pill">
              <IconStarFull />
              <span>4.6</span>
              <span className="md-details-rating-count">(328 avaliações)</span>
            </div>
            <div className="md-details-location-pill">
              <IconPlane />
              <span>{flight.airline}</span>
            </div>
            <div className="md-details-date-pill">
              <IconCalendar />
              <span>{formatDateForDisplay(flight.date)}</span>
            </div>
          </div>

          <div className="md-details-section">
            <div className="md-details-section-title">Itinerário do voo</div>
            <div className="md-details-itinerary">
              <div className="md-details-itinerary-row">
                <div className="md-details-itinerary-time">
                  <IconClock />
                  <span>{flight.departureTime}</span>
                </div>
                <div className="md-details-itinerary-location">
                  <IconMapPin />
                  <span>{flight.originCity} ({flight.originAirportCode || "ORIG"})</span>
                </div>
              </div>
              
              <div className="md-details-itinerary-line">
                <div className="md-details-itinerary-dot" />
                <div className="md-details-itinerary-dash" />
                <IconPlane className="md-details-itinerary-plane" />
                <div className="md-details-itinerary-dash" />
                <div className="md-details-itinerary-dot" />
              </div>

              <div className="md-details-itinerary-row">
                <div className="md-details-itinerary-time">
                  <IconClock />
                  <span>{flight.arrivalTime || "--:--"}</span>
                </div>
                <div className="md-details-itinerary-location">
                  <IconMapPin />
                  <span>{flight.destinationCity} ({flight.destinationAirportCode || "DEST"})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-details-section">
            <div className="md-details-section-title">O que está incluso</div>
            <div className="md-details-amenities-grid">
              {amenities.map((item, idx) => (    
                <div key={idx} className="md-details-amenity-item">
                  <span className="md-details-amenity-icon">{item.icon}</span>
                  <span className="md-details-amenity-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md-details-price-row">
            <div className="md-details-price-group">
              <span className="md-details-price-label">
                Total para {searchPeople.adults + searchPeople.children} {searchPeople.adults + searchPeople.children === 1 ? 'pessoa' : 'pessoas'}
              </span>
              <span className="md-details-price-value">
                {calculateTotalPrice(flight.price, searchPeople.adults, searchPeople.children).totalFormatted}
              </span>
            </div>
            <div className="md-details-actions">
              <button
                type="button"
                className="md-details-primary"
                onClick={handleReserve}
              >
                Reservar agora
              </button>
              <button
                type="button"
                className="md-details-secondary"
                onClick={handleBack}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlightDetailsScreen;
