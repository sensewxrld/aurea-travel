import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { hotelsMock } from "./SearchScreen.jsx";
import {
  IconBriefcase,
  IconCheckCircle,
  IconWifi,
  IconBreakfast,
  IconPool,
  IconParking,
  IconStarFull,
  IconCheck,
  IconMapPin,
  IconHeart,
} from "../components/Icons.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

function HotelDetailsScreen({ favorites, onToggleFavorite }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const hotel = hotelsMock.find((item) => item.id === id) || hotelsMock[0];

  if (!hotel) {
    return null;
  }

  const isFavorite = favorites?.some((item) => item.id === hotel.id);

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(hotel.pricePerNight, searchPeople.adults, searchPeople.children);
    navigate("/checkout", {
      state: {
        destination: {
          id: `hotel-${hotel.id}`,
          name: `${hotel.name} - ${hotel.city}`,
          price: totalPriceInfo.totalFormatted,
          serviceType: "hotel",
        },
        searchPeople,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">{hotel.name}</h1>
          <p className="md-section-subtitle">
            {hotel.city}, {hotel.country}
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite && onToggleFavorite(hotel)}
        >
          <IconHeart fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="md-details-card">
        {Array.isArray(hotel.images) && hotel.images.length > 0 && (
          <div className="md-details-section">
            <div 
              className="md-details-gallery-carousel" 
              ref={galleryRef}
              onScroll={handleScroll}
            >
              {hotel.images.map((src, idx) => (
                <div key={idx} className="md-details-gallery-slide">
                  <img src={src} alt={`${hotel.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
            <div className="md-details-gallery-counter" style={{ textAlign: 'center', marginTop: '8px' }}>
              {currentImgIndex + 1} / {hotel.images.length}
            </div>
          </div>
        )}

        <div className="md-details-body">
          <div className="md-details-meta">
            <div className="md-details-rating-pill">
              <IconStarFull />
              <span>{hotel.stars} Estrelas</span>
            </div>
            <div className="md-details-location-pill">
              <IconMapPin />
              <span>{hotel.city}</span>
            </div>
          </div>

          {hotel.description && (
            <p className="md-details-description">{hotel.description}</p>
          )}

          {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
            <div className="md-details-section">
              <div className="md-details-section-title">Comodidades</div>
              <div className="md-details-amenities-grid">
                {hotel.amenities.map((item, idx) => (
                  <div key={idx} className="md-details-amenity-item">
                    <span className="md-details-amenity-icon">
                      {item.toLowerCase().includes("wi-fi") && <IconWifi />}
                      {item.toLowerCase().includes("café da manhã") && (
                        <IconBreakfast />
                      )}
                      {item.toLowerCase().includes("piscina") && <IconPool />}
                      {item.toLowerCase().includes("estacionamento") && (
                        <IconParking />
                      )}
                      {!item.toLowerCase().includes("wi-fi") &&
                        !item.toLowerCase().includes("café da manhã") &&
                        !item.toLowerCase().includes("piscina") &&
                        !item.toLowerCase().includes("estacionamento") && (
                          <IconCheck />
                        )}
                    </span>
                    <span className="md-details-amenity-label">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(hotel.reviews) && hotel.reviews.length > 0 && (
            <div className="md-details-section">
              <div className="md-details-section-title">Avaliações</div>
              <div className="md-details-reviews-list">
                {hotel.reviews.map((review) => (
                  <article key={review.id} className="md-details-review-card">
                    <div className="md-details-review-header">
                      <div className="md-details-review-avatar">
                        {review.userName.charAt(0)}
                      </div>
                      <div className="md-details-review-user-info">
                        <div className="md-details-review-user">{review.userName}</div>
                        <div className="md-details-review-date">{review.date}</div>
                      </div>
                      <div className="md-details-review-rating">
                        <IconStarFull />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="md-details-review-comment">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="md-details-price-row">
            <div className="md-details-price-group">
              <span className="md-details-price-label">
                Total para {searchPeople.adults + searchPeople.children} {searchPeople.adults + searchPeople.children === 1 ? 'pessoa' : 'pessoas'}
              </span>
              <span className="md-details-price-value">
                {calculateTotalPrice(hotel.pricePerNight, searchPeople.adults, searchPeople.children).totalFormatted}
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

export default HotelDetailsScreen;
