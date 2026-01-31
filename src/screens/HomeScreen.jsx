import React from "react";
import { useNavigate } from "react-router-dom";
import FeaturedSection from "../components/FeaturedSection.jsx";
import { IconHeart } from "../components/Icons.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export const featuredDestinations = [
  {
    id: "rio",
    name: "Rio de Janeiro",
    badge: "-40% OFF",
    price: "R$ 899",
    rating: 4.8,
    ratingCount: 542,
    imageUrl:
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Ofertas especiais para curtir praia, trilhas e vida noturna na Cidade Maravilhosa.",
  },
  {
    id: "gramado",
    name: "Gramado",
    badge: "Pacotes selecionados",
    price: "R$ 1.250",
    rating: 4.7,
    ratingCount: 321,
    imageUrl:
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Destino de serra com clima aconchegante, gastronomia e experiências em família.",
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    badge: "-30% OFF",
    price: "R$ 1.499",
    rating: 4.6,
    ratingCount: 278,
    imageUrl:
      "https://images.pexels.com/photos/14800455/pexels-photo-14800455.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Chamadas promocionais para combinar tango, gastronomia e compras na capital argentina.",
  },
];

function HomeScreen({ favorites, onToggleFavorite }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleOpenFavorites = () => {
    navigate("/viagens");
  };

  const handleGoToSearch = () => {
    navigate("/buscar");
  };

  return (
    <>
      <section className="md-hero md-hero-home">
        <div>
          <div className="md-hero-content-eyebrow">
            <span className="md-hero-kicker-pill" />
            <span>{t("home_eyebrow")}</span>
          </div>
          <h1 className="md-hero-title">
            {t("home_title")}
          </h1>
          <p className="md-hero-subtitle">
            {t("home_subtitle_hero")}
          </p>
          <div className="md-hero-actions">
            <button
              type="button"
              className="md-primary-button"
              onClick={handleGoToSearch}
            >
              {t("home_button_search")}
            </button>
          </div>
        </div>
      </section>

      <FeaturedSection
        destinations={featuredDestinations}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        title={t("home_section_featured_title")}
        subtitle={t("home_section_featured_subtitle")}
        layout="grid"
      />

      <section className="md-section">
        <div className="md-section-header">
          <div>
            <h2 className="md-section-title">{t("home_section_experiences_title")}</h2>
            <p className="md-section-subtitle">
              {t("home_section_experiences_subtitle")}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="md-section-cta-card"
          onClick={handleGoToSearch}
        >
          <div className="md-section-cta-card-left">
            <span className="md-section-cta-card-icon">
              <IconHeart />
            </span>
            <span className="md-section-cta-card-text">
              <span className="md-section-cta-card-title">
                Ver experiências em destaque
              </span>
              <span className="md-section-cta-card-subtitle">
                Explore passeios, ingressos e atividades com alta procura.
              </span>
            </span>
          </div>
          <span className="md-section-cta-card-chevron">›</span>
        </button>
      </section>

      <section className="md-section">
        <div className="md-section-header">
          <div>
            <h2 className="md-section-title">Continue de onde parou</h2>
            <p className="md-section-subtitle">
              Acesse rapidamente seus destinos salvos e reservas em andamento.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="md-section-cta-card"
          onClick={handleOpenFavorites}
        >
          <div className="md-section-cta-card-left">
            <span className="md-section-cta-card-icon">
              <IconHeart />
            </span>
            <span className="md-section-cta-card-text">
              <span className="md-section-cta-card-title">Minhas viagens</span>
              <span className="md-section-cta-card-subtitle">
                Veja destinos salvos, favoritos e reservas em um só lugar.
              </span>
            </span>
          </div>
          <span className="md-section-cta-card-chevron">›</span>
        </button>
      </section>
    </>
  );
}

export default HomeScreen;
