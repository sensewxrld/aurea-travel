import React from "react";
import DestinationCard from "./DestinationCard.jsx";

function FeaturedSection({
  destinations,
  favorites,
  onToggleFavorite,
  title,
  subtitle,
  layout = "row",
  people,
}) {
  const sectionTitle = title || "Destinos em destaque";
  const sectionSubtitle =
    subtitle || "Escolhas selecionadas para inspirar a sua próxima viagem.";

  const rowClass = layout === "grid" 
    ? "md-featured-grid" 
    : layout === "carousel"
    ? "md-featured-carousel"
    : "md-featured-row";

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h2 className="md-section-title">{sectionTitle}</h2>
          <p className="md-section-subtitle">{sectionSubtitle}</p>
        </div>
      </div>
      <div className={rowClass}>
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            isFavorite={favorites?.some((item) => item.id === destination.id)}
            onToggleFavorite={() => onToggleFavorite(destination)}
            people={people}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedSection;
