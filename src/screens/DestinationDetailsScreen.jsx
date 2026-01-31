import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { 
  IconHeart, 
  IconStarFull, 
  IconCheck, 
  IconWifi, 
  IconCoffee, 
  IconMapPin,
  IconBreakfast,
  IconPool,
  IconParking
} from "../components/Icons.jsx";
import {
  toursMock,
  flightsMock,
  hotelsMock,
  packagesMock,
  busesMock,
} from "./SearchScreen.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

const destinations = [
  {
    id: "rio",
    name: "Rio de Janeiro",
    price: "R$ 899",
    badge: "-40% OFF",
    description:
      "Praias icônicas, vista para o Pão de Açúcar e noites animadas em um dos destinos mais desejados do Brasil.",
    imageUrl:
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    ratingCount: 542,
    images: [
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    reviews: [
      {
        id: "dr1",
        userName: "Fernanda",
        rating: 5,
        comment:
          "Cidade vibrante, com muitas opções de passeios e paisagens incríveis.",
        date: "há 2 semanas",
      },
      {
        id: "dr2",
        userName: "Rafael",
        rating: 4,
        comment:
          "Ótimo destino para quem gosta de praia e trilhas, mas trânsito intenso.",
        date: "há 1 mês",
      },
    ],
  },
  {
    id: "gramado",
    name: "Gramado",
    price: "R$ 1.250",
    badge: "Pacotes selecionados",
    description:
      "Arquitetura europeia, chocolate artesanal e clima de serra para viagens em casal ou em família.",
    imageUrl:
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.7,
    ratingCount: 321,
    images: [
      "https://images.pexels.com/photos/208733/pexels-photo-208733.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1500537/pexels-photo-1500537.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    reviews: [
      {
        id: "dg1",
        userName: "Patrícia",
        rating: 5,
        comment:
          "Cidade encantadora, clima agradável e muitas opções de passeio.",
        date: "há 3 semanas",
      },
    ],
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    price: "R$ 1.499",
    badge: "-30% OFF",
    description:
      "Gastronomia, cultura e muita história em uma das capitais mais charmosas da América Latina.",
    imageUrl:
      "https://images.pexels.com/photos/14800455/pexels-photo-14800455.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.6,
    ratingCount: 278,
    images: [
      "https://images.pexels.com/photos/14800455/pexels-photo-14800455.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/12316335/pexels-photo-12316335.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    reviews: [
      {
        id: "db1",
        userName: "Marcos",
        rating: 5,
        comment:
          "Destino perfeito para quem gosta de boa comida e programas culturais.",
        date: "há 2 meses",
      },
    ],
  },
];

function DestinationDetailsScreen({ favorites, onToggleFavorite, onReserve }) {
  const { id } = useParams();
  const destination = destinations.find((item) => item.id === id) || destinations[0];
  const navigate = useNavigate();
  const location = useLocation();
  const [reservationStatus, setReservationStatus] = useState(null);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const galleryRef = useRef(null);

  const searchPeople = location.state?.searchPeople || { adults: 1, children: 0 };

  const handleScroll = () => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.offsetWidth
      );
      setCurrentImgIndex(index);
    }
  };

  const amenities = [
    { icon: <IconWifi />, label: "Wi-Fi Grátis" },
    { icon: <IconBreakfast />, label: "Café da Manhã" },
    { icon: <IconPool />, label: "Piscina" },
    { icon: <IconParking />, label: "Estacionamento" },
    { icon: <IconCheck />, label: "Cancelamento Grátis" },
    { icon: <IconMapPin />, label: "Localização Central" },
  ];

  const reviews = [
    { 
      id: 1, 
      user: "Mariana Silva", 
      rating: 5, 
      comment: "Lugar maravilhoso! A vista é de tirar o fôlego e tudo muito organizado.",
      date: "Há 2 dias",
    },
    { 
      id: 2, 
      user: "João Pedro", 
      rating: 4, 
      comment: "Muito bom, ótima localização. Voltaria com certeza.",
      date: "Há 1 semana",
    },
  ];

  const relatedTours = useMemo(
    () =>
      toursMock.filter(
        (tour) =>
          tour.city.toLowerCase() === destination.name.toLowerCase()
      ),
    [destination.name]
  );

  const relatedHotels = useMemo(
    () =>
      hotelsMock.filter(
        (hotel) =>
          hotel.city.toLowerCase() === destination.name.toLowerCase()
      ),
    [destination.name]
  );

  const relatedFlights = useMemo(
    () =>
      flightsMock.filter(
        (flight) =>
          flight.destinationCity.toLowerCase() === destination.name.toLowerCase()
      ),
    [destination.name]
  );

  const relatedPackages = useMemo(
    () =>
      packagesMock.filter(
        (pkg) =>
          pkg.city.toLowerCase() === destination.name.toLowerCase()
      ),
    [destination.name]
  );

  const relatedBuses = useMemo(
    () =>
      busesMock.filter(
        (bus) =>
          bus.destinationCity.toLowerCase() === destination.name.toLowerCase()
      ),
    [destination.name]
  );

  const isFavorite =
    favorites && favorites.some((item) => item.id === destination.id);

  const handleReserve = () => {
    const totalPriceInfo = calculateTotalPrice(destination.price, searchPeople.adults, searchPeople.children);
    if (onReserve) {
      onReserve({
        destinationId: destination.id,
        destinationName: destination.name,
        price: totalPriceInfo.totalFormatted,
        dates: "Datas a definir",
        people: searchPeople,
        serviceType: "destino",
      });
    } else {
      setReservationStatus("success");
      navigate("/checkout", { 
        state: { 
          destination: {
            ...destination,
            price: totalPriceInfo.totalFormatted
          },
          searchPeople
        } 
      });
    }
  };

  useEffect(() => {
    if (!reservationStatus) return;
    const timeoutId = setTimeout(() => {
      setReservationStatus(null);
    }, 2600);
    return () => clearTimeout(timeoutId);
  }, [reservationStatus]);

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">{destination.name}</h1>
          <p className="md-section-subtitle">
            Brasil · Destino em destaque
          </p>
        </div>
        <button
          type="button"
          className={
            isFavorite
              ? "md-favorite-button-header md-favorite-button-active"
              : "md-favorite-button-header"
          }
          onClick={() => onToggleFavorite(destination)}
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
            {destination.images.map((img, index) => (
              <div key={index} className="md-details-gallery-slide">
                <img src={img} alt={`${destination.name} - ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="md-details-gallery-dots">
            {destination.images.map((_, index) => (
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
              <IconStarFull fill="currentColor" />
              <span>{destination.rating}</span>
              <span className="md-details-rating-count">({destination.ratingCount} avaliações)</span>
            </div>
            <div className="md-details-location-pill">
              <IconMapPin />
              <span>{destination.name}</span>
            </div>
            {destination.badge && (
              <div className="md-details-promo-pill">
                {destination.badge}
              </div>
            )}
          </div>

          <p className="md-details-description">{destination.description}</p>

          <div className="md-details-section">
            <div className="md-details-section-title">O que o destino oferece</div>
            <div className="md-details-amenities-grid">
              {amenities.map((item, idx) => (
                <div key={idx} className="md-details-amenity-item">
                  <span className="md-details-amenity-icon">{item.icon}</span>
                  <span className="md-details-amenity-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {relatedHotels.length > 0 && (
            <div className="md-details-section">
              <div className="md-details-section-title">Onde se hospedar</div>
              <div className="md-details-chips-row">
                {relatedHotels.map((hotel) => (
                  <button 
                    key={hotel.id} 
                    className="md-details-chip"
                    onClick={() => navigate(`/hoteis/${hotel.id}`)}
                  >
                    <span>{hotel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {relatedTours.length > 0 && (
            <div className="md-details-section">
              <div className="md-details-section-title">O que fazer</div>
              <div className="md-details-chips-row">
                {relatedTours.map((tour) => (
                  <button 
                    key={tour.id} 
                    className="md-details-chip"
                    onClick={() => navigate(`/passeios/${tour.id}`)}
                  >
                    <IconStarFull />
                    <span>{tour.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="md-details-price-row">
            <div className="md-details-price-group">
              <span className="md-details-price-label">a partir de</span>
              <span className="md-details-price-value">{destination.price}</span>
            </div>
            <div className="md-details-actions">
              <button
                type="button"
                className="md-details-primary"
                onClick={handleReserve}
              >
                Explorar agora
              </button>
              <button
                type="button"
                className="md-details-secondary"
                onClick={() => navigate(-1)}
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

export default DestinationDetailsScreen;
