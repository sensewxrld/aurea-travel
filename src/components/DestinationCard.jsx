import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconHeart } from "./Icons.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

const FALLBACK_DESTINATION_IMAGE =
  "https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg?auto=compress&cs=tinysrgb&w=800";

function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
  ctaLabel,
  people,
}) {
  const navigate = useNavigate();

  const [currentSrc, setCurrentSrc] = useState(
    destination.imageUrl || FALLBACK_DESTINATION_IMAGE
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    if (currentSrc !== FALLBACK_DESTINATION_IMAGE) {
      setCurrentSrc(FALLBACK_DESTINATION_IMAGE);
      return;
    }
    setIsLoaded(true);
  };

  const mediaClassName = isLoaded
    ? "md-destination-media md-destination-media-loaded"
    : "md-destination-media";

  const buttonLabel = ctaLabel || "Ver detalhes";

  const handleClick = () => {
    if (destination.id) {
      navigate(`/destinos/${destination.id}`, { state: { searchPeople: people } });
    }
  };

  return (
    <article className="md-destination-card" onClick={handleClick}>
      <div className={mediaClassName}>
        <img
          src={currentSrc}
          alt={destination.name}
          className="md-destination-media-img"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
        />
        {(destination.badge || true) && (
          <div className={`md-destination-promo-badge ${!(destination.badge || "Destaque").includes("OFF") ? "md-destination-promo-badge-alt" : ""}`}>
            {destination.badge || "Destaque"}
          </div>
        )}
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button md-favorite-button-active"
              : "md-favorite-button"
          }
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={!!isFavorite}
          onClick={(event) => {
            event.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite();
            }
          }}
        >
          <IconHeart />
        </button>
        <div className="md-destination-overlay">
          <div className="md-destination-content">
            <div className="md-destination-header">
              <div className="md-destination-location">{destination.name}</div>
            </div>
            <div className="md-destination-price-row">
              <div className="md-destination-price">
                <span className="md-destination-price-label">
                  {people ? `Total para ${people.adults + people.children} ${people.adults + people.children === 1 ? 'pessoa' : 'pessoas'}` : "a partir de"}
                </span>
                <span className="md-destination-price-value">
                  {people 
                    ? calculateTotalPrice(destination.price, people.adults, people.children).totalFormatted 
                    : destination.price
                  }
                </span>
              </div>
              <button type="button" className="md-destination-button">
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
