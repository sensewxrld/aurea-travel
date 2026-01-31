import React from "react";
import DestinationCard from "../components/DestinationCard.jsx";
import { featuredDestinations } from "./HomeScreen.jsx";

function FeaturedDestinationsScreen({ favorites, onToggleFavorite }) {
  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Destinos em destaque</h1>
          <p className="md-section-subtitle">
            Explore destinos selecionados com ofertas e condições especiais.
          </p>
        </div>
      </div>
      <div className="md-featured-list">
        {featuredDestinations.map((destination) => (
          <div key={destination.id}>
            <DestinationCard
              destination={destination}
              isFavorite={favorites?.some(
                (item) => item.id === destination.id
              )}
              onToggleFavorite={() => onToggleFavorite(destination)}
              ctaLabel="Ver ofertas"
            />
            {destination.description && (
              <p className="md-section-subtitle">{destination.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedDestinationsScreen;
