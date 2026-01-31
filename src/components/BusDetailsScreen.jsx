import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { busesMock } from "../screens/SearchScreen.jsx";
import {
  IconMapPin,
  IconClock,
  IconCheck,
  IconStarFull,
  IconBriefcase,
  IconWifi,
  IconHeart,
} from "./Icons.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

function BusDetailsScreen({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const bus = busesMock.find((item) => item.id === id) || busesMock[0];

  if (!bus) {
    return null;
  }

  const isFavorite = favorites?.some((item) => item.id === bus.id);

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(bus.price, searchPeople.adults, searchPeople.children);
    navigate("/checkout", {
      state: {
        destination: {
          id: `bus-${bus.id}`,
          name: `${bus.originCity} → ${bus.destinationCity}`,
          price: totalPriceInfo.totalFormatted,
          serviceType: "onibus",
        },
        searchPeople,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const stopsLabel = bus.isDirect
    ? "Sem paradas"
    : bus.stops === 1
    ? "1 parada"
    : `${bus.stops || 2}+ paradas`;

  const amenities = [
    { icon: <IconCheck />, label: `Assento ${bus.seatType}` },
    { icon: <IconClock />, label: `${bus.durationHours}h de viagem` },
    { icon: <IconBriefcase />, label: "Bagagem inclusa" },
    { icon: <IconWifi />, label: "Wi-Fi a bordo" },
    { icon: <IconCheck />, label: "Ar condicionado" },
    { icon: <IconCheck />, label: "Tomada USB" },
  ];

  const images = [
    "https://images.pexels.com/photos/385998/pexels-photo-385998.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">
            {bus.originCity} → {bus.destinationCity}
          </h1>
          <p className="md-section-subtitle">
            {bus.company} · {stopsLabel}
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite && onToggleFavorite(bus)}
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
                <img src={img} alt={`${bus.company} - ${index + 1}`} />
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
              <span>4.7</span>
              <span className="md-details-rating-count">(76 avaliações)</span>
            </div>
            <div className="md-details-location-pill">
              <IconMapPin />
              <span>{bus.company}</span>
            </div>
          </div>

          <div className="md-details-section">
            <div className="md-details-section-title">Itinerário da viagem</div>
            <div className="md-details-itinerary">
              <div className="md-details-itinerary-row">
                <div className="md-details-itinerary-time">
                  <IconClock />
                  <span>{bus.departureTime}</span>
                </div>
                <div className="md-details-itinerary-location">
                  <IconMapPin />
                  <span>{bus.originCity}</span>
                </div>
              </div>
              
              <div className="md-details-itinerary-line">
                <div className="md-details-itinerary-dot" />
                <div className="md-details-itinerary-dash" />
                <div className="md-details-itinerary-dash" />
                <div className="md-details-itinerary-dot" />
              </div>

              <div className="md-details-itinerary-row">
                <div className="md-details-itinerary-time">
                  <IconClock />
                  <span>{bus.arrivalTime}</span>
                </div>
                <div className="md-details-itinerary-location">
                  <IconMapPin />
                  <span>{bus.destinationCity}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md-details-section">
            <div className="md-details-section-title">O que esta viagem oferece</div>
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
                {calculateTotalPrice(bus.price, searchPeople.adults, searchPeople.children).totalFormatted}
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

export default BusDetailsScreen;

