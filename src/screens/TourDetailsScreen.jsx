import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  IconBriefcase, 
  IconUser, 
  IconGlobe, 
  IconCheckCircle, 
  IconStarFull, 
  IconMapPin, 
  IconCheck, 
  IconClock, 
  IconUsers,
  IconHeart 
} from "../components/Icons.jsx";
import { toursMock } from "./SearchScreen.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

function TourDetailsScreen({ favorites, onToggleFavorite }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const tour = toursMock.find((item) => item.id === id) || toursMock[0];

  if (!tour) {
    return null;
  }

  const isFavorite = favorites?.some((item) => item.id === tour.id);

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(tour.price, searchPeople.adults, searchPeople.children);
    navigate("/checkout", {
      state: {
        destination: {
          id: `tour-${tour.id}`,
          name: tour.title,
          price: totalPriceInfo.totalFormatted,
          serviceType: "passeio",
        },
        searchPeople,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const amenities = [
    { icon: <IconClock />, label: `${tour.durationHours}h de duração` },
    { icon: <IconUsers />, label: `Até ${tour.people} pessoas` },
    { icon: <IconGlobe />, label: tour.experienceType },
    { icon: <IconCheck />, label: "Confirmação imediata" },
  ];

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">{tour.title}</h1>
          <p className="md-section-subtitle">
            {tour.city}, {tour.country}
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite && onToggleFavorite(tour)}
        >
          <IconHeart fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="md-details-card">
        {tour.imageUrl && (
          <div className="md-details-section">
            <div 
              className="md-details-gallery-carousel" 
              ref={galleryRef}
              onScroll={handleScroll}
            >
              <div className="md-details-gallery-slide">
                <img src={tour.imageUrl} alt={tour.title} />
              </div>
              {/* If there were more images, they would go here */}
            </div>
          </div>
        )}

        <div className="md-details-body">
          <div className="md-details-meta">
            <div className="md-details-rating-pill">
              <IconStarFull />
              <span>4.8</span>
              <span className="md-details-rating-count">(42 avaliações)</span>
            </div>
            <div className="md-details-location-pill">
              <IconMapPin />
              <span>{tour.city}</span>
            </div>
          </div>

          <p className="md-details-description">{tour.description}</p>

          <div className="md-details-section">
            <div className="md-details-section-title">O que esperar</div>
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
                {calculateTotalPrice(tour.price, searchPeople.adults, searchPeople.children).totalFormatted}
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

export default TourDetailsScreen;
