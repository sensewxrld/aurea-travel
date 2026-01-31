import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { packagesMock } from "./SearchScreen.jsx";
import {
  IconPlane,
  IconBriefcase,
  IconCheck,
  IconStarFull,
  IconMapPin,
  IconBreakfast,
  IconHeart,
} from "../components/Icons.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

function PackageDetailsScreen({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const pkg = packagesMock.find((item) => item.id === id) || packagesMock[0];

  if (!pkg) {
    return null;
  }

  const isFavorite = favorites?.some((item) => item.id === pkg.id);

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(pkg.price, searchPeople.adults, searchPeople.children);
    navigate("/checkout", {
      state: {
        destination: {
          id: `package-${pkg.id}`,
          name: pkg.title,
          price: totalPriceInfo.totalFormatted,
          serviceType: "pacote",
        },
        searchPeople,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const amenities = [
    ...(pkg.includesFlight ? [{ icon: <IconPlane />, label: "Voo incluso" }] : []),
    ...(pkg.includesHotel ? [{ icon: <IconBriefcase />, label: "Hospedagem inclusa" }] : []),
    ...(pkg.includesTours ? [{ icon: <IconStarFull />, label: "Passeios inclusos" }] : []),
    ...(pkg.includesTransfer ? [{ icon: <IconCheck />, label: "Transporte incluso" }] : []),
    { icon: <IconBreakfast />, label: "Café da manhã incluso" },
    { icon: <IconCheck />, label: "Cancelamento grátis" },
  ];

  const images = [
    "https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1007066/pexels-photo-1007066.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2041556/pexels-photo-2041556.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">{pkg.title}</h1>
          <p className="md-section-subtitle">
            {pkg.city}, {pkg.country} · {pkg.days} dias
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite && onToggleFavorite(pkg)}
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
                <img src={img} alt={`${pkg.title} - ${index + 1}`} />
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
              <span>4.9</span>
              <span className="md-details-rating-count">(142 avaliações)</span>
            </div>
            <div className="md-details-location-pill">
              <IconMapPin />
              <span>{pkg.city}</span>
            </div>
            {pkg.badge && (
              <div className="md-details-promo-pill">
                {pkg.badge}
              </div>
            )}
          </div>

          <p className="md-details-description">{pkg.description}</p>

          <div className="md-details-section">
            <div className="md-details-section-title">O que está incluso no pacote</div>
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
              <span className="md-details-price-label">a partir de</span>
              <span className="md-details-price-value">{pkg.price}</span>
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

export default PackageDetailsScreen;

