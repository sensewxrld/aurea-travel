import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconCalendar, IconPlane, IconStarFull } from "../components/Icons.jsx";
import SearchCard from "../components/SearchBar.jsx";
import ServiceTabs from "../components/ServiceTabs.jsx";
import FeaturedSection from "../components/FeaturedSection.jsx";
import { featuredDestinations } from "./HomeScreen.jsx";
import { calculateTotalPrice } from "../utils/pricing.js";

export const toursMock = [
  {
    id: "p1",
    title: "Ilhas de Angra dos Reis de barco",
    description:
      "Passeio de barco com paradas para banho em praias e ilhas de água cristalina.",
    city: "Angra dos Reis",
    country: "Brasil",
    imageUrl:
      "https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 7,
    people: 20,
    date: "2026-02-10",
    price: "R$ 350",
    rating: 4.8,
    ratingCount: 182,
    includes: [
      "Transporte marítimo ida e volta",
      "Paradas para banho em 3 praias",
      "Guia local credenciado",
      "Água e frutas a bordo",
    ],
    meetingPoint: "Marina central de Angra dos Reis",
    reviews: [
      {
        id: "r1",
        userName: "Fernanda",
        rating: 5,
        comment: "Passeio incrível, equipe atenciosa e lugares lindos.",
        date: "há 2 semanas",
      },
      {
        id: "r2",
        userName: "Carlos",
        rating: 4,
        comment: "Barco confortável, só senti falta de mais tempo nas paradas.",
        date: "há 1 mês",
      },
    ],
    experienceType: "barco",
    badge: "Mais vendido",
    featuredPriority: 1,
  },
  {
    id: "p2",
    title: "City tour histórico no Rio de Janeiro",
    description:
      "Visita guiada pelos principais pontos do centro histórico, com tempo para fotos.",
    city: "Rio de Janeiro",
    country: "Brasil",
    imageUrl:
      "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 4,
    people: 15,
    date: "2026-03-05",
    price: "R$ 260",
    rating: 4.7,
    ratingCount: 96,
    includes: [
      "Transporte climatizado",
      "Guia bilíngue",
      "Ingresso para principais atrações",
    ],
    meetingPoint: "Praça XV, em frente ao ponto de encontro indicado no voucher",
    reviews: [
      {
        id: "r3",
        userName: "Ana",
        rating: 5,
        comment: "Roteiro bem organizado, deu para ver muita coisa em pouco tempo.",
        date: "há 3 semanas",
      },
    ],
    experienceType: "city tour",
    badge: "Recomendado",
    featuredPriority: 2,
  },
  {
    id: "p3",
    title: "Trilha guiada no Pico da Bandeira",
    description:
      "Subida em grupo com guia especializado e paradas estratégicas para apreciar a paisagem.",
    city: "Alto Caparaó",
    country: "Brasil",
    imageUrl:
      "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 8,
    people: 8,
    date: "2026-04-12",
    price: "R$ 420",
    rating: 4.9,
    ratingCount: 54,
    includes: [
      "Guia especializado em montanha",
      "Kit lanterna e bastão de caminhada",
      "Lanche de trilha",
    ],
    meetingPoint: "Portaria principal do Parque Nacional do Caparaó",
    reviews: [
      {
        id: "r4",
        userName: "Roberto",
        rating: 5,
        comment: "Trilha exigente, mas a vista no topo compensa qualquer esforço.",
        date: "há 2 meses",
      },
    ],
    experienceType: "trilha",
    badge: "Experiência exclusiva",
    featuredPriority: 0,
  },
  {
    id: "p4",
    title: "Ingresso Beto Carrero World com transfer",
    description:
      "Dia completo em um dos maiores parques temáticos da América Latina, com transporte incluso.",
    city: "Penha",
    country: "Brasil",
    imageUrl:
      "https://images.pexels.com/photos/3411135/pexels-photo-3411135.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 10,
    people: 30,
    date: "2026-05-20",
    price: "R$ 390",
    rating: 4.6,
    ratingCount: 310,
    includes: [
      "Ingresso Beto Carrero World",
      "Transporte ida e volta",
      "Acompanhamento de guia",
    ],
    meetingPoint: "Saída de hotéis selecionados em Balneário Camboriú",
    reviews: [
      {
        id: "r5",
        userName: "Juliana",
        rating: 4,
        comment: "Parque incrível, mas o dia foi bem corrido.",
        date: "há 3 meses",
      },
    ],
    experienceType: "ingresso",
    badge: "Mais vendido",
    featuredPriority: 3,
  },
  {
    id: "p5",
    title: "Walking tour pelo centro histórico de Lisboa",
    description:
      "Passeio a pé por miradouros, praças e ruas históricas da capital portuguesa.",
    city: "Lisboa",
    country: "Portugal",
    imageUrl:
      "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 3,
    people: 12,
    date: "2026-06-18",
    price: "€ 210",
    rating: 4.9,
    ratingCount: 72,
    includes: [
      "Guia local",
      "Paradas em miradouros principais",
      "Degustação de pastel de nata",
    ],
    meetingPoint: "Praça Luís de Camões, Bairro Chiado",
    reviews: [
      {
        id: "r6",
        userName: "Miguel",
        rating: 5,
        comment: "Guias muito simpáticos e experientes, passeio leve e agradável.",
        date: "há 1 mês",
      },
    ],
    experienceType: "city tour",
    badge: "Recomendado",
    featuredPriority: 1,
  },
  {
    id: "p6",
    title: "Pôr do sol de catamarã em Recife",
    description:
      "Experiência exclusiva para acompanhar o pôr do sol a bordo de um catamarã.",
    city: "Recife",
    country: "Brasil",
    imageUrl:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
    durationHours: 3,
    people: 16,
    date: "2026-07-08",
    price: "R$ 280",
    rating: 4.8,
    ratingCount: 41,
    includes: [
      "Passeio de catamarã",
      "Taça de espumante de boas-vindas",
    ],
    meetingPoint: "Cais do Marco Zero, Recife Antigo",
    reviews: [
      {
        id: "r7",
        userName: "Patrícia",
        rating: 5,
        comment: "Pôr do sol inesquecível, trilha sonora boa e equipe animada.",
        date: "há 2 semanas",
      },
    ],
    experienceType: "experiência exclusiva",
    badge: "Experiência exclusiva",
    featuredPriority: 1,
  },
];

export const flightsMock = [
  {
    id: "v1",
    airline: "Auréa Travel Air",
    airlineCode: "AT",
    originCity: "São Paulo",
    originCountry: "Brasil",
    originAirportCode: "GRU",
    originAirportName: "Guarulhos",
    destinationCity: "Fortaleza",
    destinationCountry: "Brasil",
    destinationAirportCode: "FOR",
    destinationAirportName: "Pinto Martins",
    date: "2026-02-15",
    durationHours: 3.5,
    price: "R$ 850",
    departureTime: "08:10",
    arrivalTime: "11:40",
    isDirect: true,
    co2Info: "18% menos CO₂ que a média da rota",
    rating: 4.6,
    ratingCount: 328,
    reviews: [
      {
        id: "fv1",
        userName: "Camila",
        rating: 5,
        comment: "Tripulação atenciosa e voo pontual.",
        date: "há 1 mês",
      },
      {
        id: "fv2",
        userName: "João",
        rating: 4,
        comment: "Aeronave confortável, serviço de bordo poderia ser melhor.",
        date: "há 2 meses",
      },
    ],
  },
  {
    id: "v2",
    airline: "Latam",
    airlineCode: "LA",
    originCity: "Rio de Janeiro",
    originCountry: "Brasil",
    originAirportCode: "GIG",
    originAirportName: "Galeão",
    destinationCity: "Santiago",
    destinationCountry: "Chile",
    destinationAirportCode: "SCL",
    destinationAirportName: "Arturo Merino Benítez",
    date: "2026-08-16",
    durationHours: 4.2,
    price: "R$ 1.350",
    departureTime: "14:30",
    arrivalTime: "18:45",
    isDirect: false,
    stops: 1,
    co2Info: "Emissão semelhante à média da rota",
    rating: 4.4,
    ratingCount: 212,
    reviews: [
      {
        id: "fv3",
        userName: "Marina",
        rating: 4,
        comment: "Conexão rápida e serviço de bordo muito bom.",
        date: "há 3 semanas",
      },
    ],
  },
];

export const hotelsMock = [
  {
    id: "h1",
    name: "Rede Andrade Ondina Salvador",
    city: "Salvador",
    country: "Brasil",
    stars: 4,
    distance: "4,69 km",
    pricePerNight: "R$ 171",
    rating: 3.3,
    ratingText: "Regular",
    ratingCount: 424,
    description:
      "Hotel em frente à praia, com quartos climatizados, vista para o mar e área de lazer completa.",
    amenities: [
      "Wi-Fi gratuito",
      "Café da manhã incluso",
      "Piscina externa",
      "Estacionamento",
      "Recepção 24h",
    ],
    images: [
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    reviews: [
      {
        id: "rh1",
        userName: "Mariana",
        rating: 5,
        comment: "Localização excelente e funcionários muito atenciosos.",
        date: "há 3 semanas",
      },
      {
        id: "rh2",
        userName: "Tiago",
        rating: 4,
        comment: "Quarto confortável, só achei o café da manhã um pouco cheio.",
        date: "há 1 mês",
      },
    ],
  },
  {
    id: "h2",
    name: "Rede Andrade Riviera Premium",
    city: "Salvador",
    country: "Brasil",
    stars: 4,
    distance: "6,37 km",
    pricePerNight: "R$ 171",
    rating: 3.3,
    ratingText: "Regular",
    ratingCount: 866,
    description:
      "Hotel charmoso no centro histórico, próximo a miradouros, praças e principais atrações.",
    amenities: [
      "Wi-Fi gratuito",
      "Café da manhã opcional",
      "Recepção 24h",
      "Depósito de bagagem",
    ],
    images: [
      "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    reviews: [
      {
        id: "rh3",
        userName: "Clara",
        rating: 4,
        comment: "Ótimo custo-benefício e localização muito boa.",
        date: "há 2 meses",
      },
    ],
  },
];

export const packagesMock = [
  {
    id: "pa1",
    title: "Fortaleza All Inclusive",
    description: "Voo + hotel e passeios selecionados.",
    city: "Fortaleza",
    country: "Brasil",
    days: 5,
    price: "R$ 3.200",
    includesFlight: true,
    includesHotel: true,
    includesTours: true,
    includesTransfer: true,
    rating: 4.7,
    ratingCount: 142,
    reviews: [
      {
        id: "rp1",
        userName: "Gabriel",
        rating: 5,
        comment: "Tudo muito bem organizado, não precisei me preocupar com nada.",
        date: "há 1 mês",
      },
    ],
  },
  {
    id: "pa2",
    title: "Rio de Janeiro Essencial",
    description: "Hotel e principais passeios incluídos.",
    city: "Rio de Janeiro",
    country: "Brasil",
    days: 4,
    price: "R$ 2.100",
    includesFlight: false,
    includesHotel: true,
    includesTours: true,
    includesTransfer: false,
    rating: 4.5,
    ratingCount: 89,
    reviews: [
      {
        id: "rp2",
        userName: "Luiza",
        rating: 4,
        comment: "Passeios muito bons, hotel confortável.",
        date: "há 3 semanas",
      },
    ],
  },
];

export const busesMock = [
  {
    id: "o1",
    company: "Expresso Litoral",
    companyCode: "EL",
    comfortLevel: "Leito completo",
    originCity: "São Paulo",
    destinationCity: "Rio de Janeiro",
    durationHours: 6,
    price: "R$ 130",
    departureTime: "22:00",
    arrivalTime: "04:00",
    seatType: "Leito",
    isDirect: true,
    rating: 4.4,
    ratingCount: 76,
    reviews: [
      {
        id: "ob1",
        userName: "Felipe",
        rating: 4,
        comment: "Ônibus confortável e pontual, paradas bem distribuídas.",
        date: "há 1 mês",
      },
    ],
  },
  {
    id: "o2",
    company: "Serra Bus",
    companyCode: "SB",
    comfortLevel: "Semi-leito",
    originCity: "Belo Horizonte",
    destinationCity: "Ouro Preto",
    durationHours: 2.5,
    price: "R$ 80",
    departureTime: "09:30",
    arrivalTime: "12:00",
    seatType: "Semi-leito",
    isDirect: false,
    stops: 1,
    rating: 4.2,
    ratingCount: 54,
    reviews: [
      {
        id: "ob2",
        userName: "Larissa",
        rating: 4,
        comment: "Boa opção para viagem curta, equipe atenciosa.",
        date: "há 2 meses",
      },
    ],
  },
];

const FALLBACK_TOUR_IMAGE =
  "https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg?auto=compress&cs=tinysrgb&w=800";

function TourMedia({ src, alt }) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_TOUR_IMAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (currentSrc !== FALLBACK_TOUR_IMAGE) {
      setCurrentSrc(FALLBACK_TOUR_IMAGE);
      return;
    }
    setIsLoaded(true);
  };

  const mediaClassName = isLoaded
    ? "md-result-media md-result-media-loaded"
    : "md-result-media";

  return (
    <div className={mediaClassName}>
      <img
        src={currentSrc}
        alt={alt}
        className="md-result-media-img"
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function SearchScreen({ favorites, onToggleFavorite }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState =
    (location.state && typeof location.state === "object" && location.state) ||
    {};
  const [activeService, setActiveService] = useState(
    initialState.activeService || "passeios"
  );
  const [destinationValue, setDestinationValue] = useState(
    initialState.destinationValue || ""
  );
  const [dateStartValue, setDateStartValue] = useState(
    initialState.dateStartValue || ""
  );
  const [dateEndValue, setDateEndValue] = useState(
    initialState.dateEndValue || ""
  );
  const [peopleValue, setPeopleValue] = useState(
    initialState.peopleValue || { adults: 2, children: 0 }
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [destinationError, setDestinationError] = useState("");
  const [dateError, setDateError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const normalizedQuery = destinationValue.trim().toLowerCase();

  const hasFilters =
    !!destinationValue.trim() || !!dateStartValue || !!dateEndValue;
  const isPasseios = activeService === "passeios";

  const filteredFlights = useMemo(() => {
    if (!normalizedQuery) return flightsMock;
    return flightsMock.filter((flight) => {
      const target =
        `${flight.originCity} ${flight.destinationCity} ${flight.airline}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredTours = useMemo(() => {
    let result = toursMock;

    if (normalizedQuery) {
      result = result.filter((tour) => {
        const target = `${tour.title} ${tour.city} ${tour.country}`.toLowerCase();
        return target.includes(normalizedQuery);
      });
    }

    const hasDateStart = !!dateStartValue;
    const hasDateEnd = !!dateEndValue;

    if (hasDateStart || hasDateEnd) {
      const start = hasDateStart ? new Date(dateStartValue) : null;
      const end = hasDateEnd ? new Date(dateEndValue) : null;

      result = result.filter((tour) => {
        if (!tour.date) return true;
        const tourDate = new Date(tour.date);
        if (start && end) {
          return tourDate >= start && tourDate <= end;
        }
        if (start) {
          return tourDate >= start;
        }
        if (end) {
          return tourDate <= end;
        }
        return true;
      });
    }

    if (peopleValue && (peopleValue.adults || peopleValue.children)) {
      const totalPeople =
        (typeof peopleValue.adults === "number" ? peopleValue.adults : 0) +
        (typeof peopleValue.children === "number" ? peopleValue.children : 0);

      if (totalPeople > 0) {
        result = result.filter((tour) => {
          if (typeof tour.people !== "number") return true;
          return tour.people >= totalPeople;
        });
      }
    }

    return result;
  }, [normalizedQuery, dateStartValue, dateEndValue, peopleValue]);

  const filteredHotels = useMemo(() => {
    if (!normalizedQuery) return hotelsMock;
    return hotelsMock.filter((hotel) => {
      const target = `${hotel.name} ${hotel.city} ${hotel.country}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredPackages = useMemo(() => {
    if (!normalizedQuery) return packagesMock;
    return packagesMock.filter((pkg) => {
      const target = `${pkg.title} ${pkg.city} ${pkg.country}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredBuses = useMemo(() => {
    if (!normalizedQuery) return busesMock;
    return busesMock.filter((bus) => {
      const target = `${bus.originCity} ${bus.destinationCity} ${bus.company}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const featuredTours = useMemo(() => {
    return [...toursMock]
      .sort((a, b) => {
        const priorityA = typeof a.featuredPriority === "number" ? a.featuredPriority : 99;
        const priorityB = typeof b.featuredPriority === "number" ? b.featuredPriority : 99;
        if (priorityA !== priorityB) return priorityA - priorityB;
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, 6);
  }, []);

  const handleSearch = () => {
    setDestinationError("");
    setDateError("");

    const hasDestination = !!destinationValue.trim();
    const hasDateStart = !!dateStartValue;

    if (!hasDestination && !hasDateStart && !dateEndValue) {
      setIsSearching(true);
      setTimeout(() => {
        setHasSearched(true);
        setIsSearching(false);
      }, 400);
      return;
    }

    let hasError = false;
    if (!hasDestination) {
      setDestinationError("Informe um destino para buscar passeios.");
      hasError = true;
    }
    if (!hasDateStart) {
      setDateError("Informe a data de ida.");
      hasError = true;
    }
    if (hasError) {
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setHasSearched(true);
      setIsSearching(false);
    }, 400);
  };

  const showResults = hasSearched || normalizedQuery.length > 0;

  const formatDateForDisplay = (value) => {
    if (!value) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const dateRangeDisplay =
    dateStartValue && dateEndValue
      ? `${formatDateForDisplay(dateStartValue)} → ${formatDateForDisplay(
          dateEndValue
        )}`
      : "";

  const peopleDisplay = (() => {
    if (!peopleValue) return "";
    const { adults, children } = peopleValue;
    const parts = [];
    if (typeof adults === "number" && adults > 0) {
      parts.push(`${adults} ${adults === 1 ? "adulto" : "adultos"}`);
    }
    if (typeof children === "number" && children > 0) {
      parts.push(`${children} ${children === 1 ? "criança" : "crianças"}`);
    }
    return parts.join(", ");
  })();

  const showHighlightResults = isPasseios && hasSearched && !hasFilters;

  const sectionTitle = isPasseios
    ? hasFilters
      ? "Passeios disponíveis para o período selecionado"
      : "Experiências em destaque"
    : "Resultados";

  const sectionSubtitle = isPasseios
    ? hasFilters
      ? "Veja experiências selecionadas conforme o destino e as datas escolhidas."
      : "Sugestões populares para inspirar sua próxima viagem."
    : "Opções disponíveis para as datas e destino selecionados.";

  const goToCheckout = (destination) => {
    navigate("/checkout", {
      state: {
        destination,
        searchDates: {
          start: dateStartValue || null,
          end: dateEndValue || null,
          label: dateRangeDisplay || null,
        },
        searchPeople: peopleValue || null,
      },
    });
  };

  return (
    <>
      <section className="md-section">
        <div className="md-section-header">
          <div>
            <h1 className="md-section-title">Buscar viagens</h1>
            <p className="md-section-subtitle">
              Refine destino, datas e pessoas para encontrar a opção ideal.
            </p>
          </div>
        </div>
        <ServiceTabs
          activeService={activeService}
          onChange={(serviceId) => {
            setActiveService(serviceId);
            setHasSearched(false);
            setDestinationError("");
            setDateError("");
          }}
        />
        <SearchCard
          activeService={activeService}
          destinationValue={destinationValue}
          dateStartValue={dateStartValue}
          dateEndValue={dateEndValue}
          peopleValue={peopleValue}
          destinationError={destinationError}
          dateError={dateError}
          onDestinationChange={setDestinationValue}
          onDateStartChange={setDateStartValue}
          onDateEndChange={setDateEndValue}
          onPeopleChange={setPeopleValue}
          onSubmit={handleSearch}
        />
      </section>

      <FeaturedSection
        destinations={featuredDestinations}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        title="Em alta agora"
        layout="carousel"
        people={peopleValue}
        subtitle={
          activeService === "passeios"
            ? "Destinos com passeios, ingressos e experiências em destaque."
            : activeService === "voos"
            ? "Principais rotas com ótimas tarifas para começar a planejar."
            : activeService === "hoteis"
            ? "Cidades em alta para encontrar hospedagens com condições especiais."
            : activeService === "pacotes"
            ? "Combinações de voo + hotel em destinos muito buscados."
            : "Sugestões de destinos em alta para sua próxima viagem."
        }
      />

      <section className="md-section">
        <div className="md-section-header">
          <div>
            <h2 className="md-section-title">
              {sectionTitle}
            </h2>
            <p className="md-section-subtitle">
              {sectionSubtitle}
            </p>
          </div>
        </div>

        {!showResults && !isSearching && (
          <div className="md-empty-card">
            <div className="md-empty-title">Comece buscando um destino</div>
            <p className="md-empty-subtitle">
              Use o campo de destino para encontrar voos, hotéis, pacotes, passeios ou ônibus.
            </p>
          </div>
        )}

        {isSearching && (
          <>
            <div className="md-empty-card">
              <div className="md-empty-title">Buscando as melhores opções</div>
              <p className="md-empty-subtitle">
                Aguarde um instante enquanto encontramos opções para o período selecionado.
              </p>
            </div>
            {activeService === "passeios" && (
              <div className="md-result-list">
                {[0, 1, 2].map((index) => (
                  <article
                    key={index}
                    className="md-result-card md-result-card-loading"
                  >
                    <div className="md-result-media" />
                    <div className="md-result-title-row">
                      <div className="md-skeleton-line md-skeleton-line-title" />
                    </div>
                    <div className="md-skeleton-line md-skeleton-line-subtitle" />
                    <div className="md-skeleton-line md-skeleton-line-meta" />
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {showResults && activeService === "voos" && (
          <div className="md-result-list">
            {filteredFlights.map((flight) => (
              <article key={flight.id} className="md-result-card">
                <div className="md-flight-header">
                  <div className="md-airline-info">
                    <div className="md-airline-logo-placeholder">
                      {flight.airlineCode}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>
                      {flight.airline}
                    </span>
                  </div>
                  {flight.date && (
                    <div className="md-flight-date-highlight">
                      <IconCalendar style={{ width: "14px", height: "14px" }} />
                      <span>{formatDateForDisplay(flight.date)}</span>
                    </div>
                  )}
                </div>

                <div className="md-divider" />

                <div className="md-result-title-row">
                  <div className="md-result-title">
                    {flight.originCity} ({flight.originAirportCode}) →{" "}
                    {flight.destinationCity} ({flight.destinationAirportCode})
                  </div>
                  <div className="md-result-price">
                    {calculateTotalPrice(flight.price, peopleValue.adults, peopleValue.children).totalFormatted}
                  </div>
                </div>
                <div className="md-result-subtitle">
                  {flight.departureTime} · {flight.durationHours}h ·{" "}
                  {flight.arrivalTime} ·{" "}
                  {flight.isDirect
                    ? "Sem escalas"
                    : flight.stops === 1
                    ? "1 parada"
                    : `${flight.stops || 2}+ paradas`}
                </div>
                {flight.co2Info && (
                  <div className="md-result-meta">{flight.co2Info}</div>
                )}
                {dateRangeDisplay && (
                  <div className="md-result-meta">
                    Período da viagem: {dateRangeDisplay}
                  </div>
                )}
                <div className="md-result-actions">
                  <button
                    type="button"
                    className="md-details-primary"
                    onClick={() => navigate(`/voos/${flight.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showResults && activeService === "hoteis" && (
          <div className="md-result-list">
            {filteredHotels.map((hotel) => (
              <article key={hotel.id} className="md-hotel-card">
                <div className="md-hotel-card-image-wrapper">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="md-hotel-card-image"
                  />
                </div>
                <div className="md-hotel-card-content">
                  <div className="md-hotel-card-header">
                    <h3 className="md-hotel-card-title">{hotel.name}</h3>
                    {hotel.stars && (
                      <div className="md-hotel-card-stars">
                        {[...Array(hotel.stars)].map((_, i) => (
                          <IconStarFull
                            key={i}
                            width="14"
                            height="14"
                            style={{ color: "#fbbf24", fill: "#fbbf24" }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md-hotel-card-distance">
                    A {hotel.distance || "0 km"} do centro da cidade
                  </div>
                  <div className="md-hotel-card-rating-row">
                    <span className="md-hotel-card-rating-text">
                      {hotel.ratingText || "Excelente localização"}
                    </span>
                    {hotel.ratingCount && (
                      <span className="md-hotel-card-rating-count">
                        ({hotel.ratingCount} avaliações)
                      </span>
                    )}
                  </div>
                  <div className="md-hotel-card-footer">
                    <div className="md-hotel-card-price-block">
                      <span className="md-hotel-card-price-value">
                        {calculateTotalPrice(hotel.pricePerNight, peopleValue.adults, peopleValue.children).totalFormatted}
                      </span>
                      <span className="md-hotel-card-price-label">
                        Total para {peopleValue.adults + peopleValue.children} {peopleValue.adults + peopleValue.children === 1 ? 'pessoa' : 'pessoas'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="md-hotel-card-link-overlay"
                  onClick={() => navigate(`/hoteis/${hotel.id}`)}
                >
                  Ver detalhes
                </button>
              </article>
            ))}
          </div>
        )}

        {showResults && activeService === "pacotes" && (
          <div className="md-result-list">
            {filteredPackages.map((pkg) => (
              <article key={pkg.id} className="md-result-card">
                <div className="md-result-title-row">
                  <div className="md-result-title">{pkg.title}</div>
                  <div className="md-result-price">
                    {calculateTotalPrice(pkg.price, peopleValue.adults, peopleValue.children).totalFormatted}
                  </div>
                </div>
                <div className="md-result-subtitle">
                  {pkg.city}, {pkg.country} · {pkg.days} dias
                </div>
                <div className="md-result-meta">
                  {[
                    pkg.includesFlight && "Voo",
                    pkg.includesHotel && "Hotel",
                    pkg.includesTours && "Passeios",
                    pkg.includesTransfer && "Transporte",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <div className="md-result-description">{pkg.description}</div>
                {dateRangeDisplay && (
                  <div className="md-result-meta">
                    Período desejado: {dateRangeDisplay}
                  </div>
                )}
                {peopleDisplay && (
                  <div className="md-result-meta">Viajantes: {peopleDisplay}</div>
                )}
                <div className="md-result-actions">
                  <button
                    type="button"
                    className="md-details-primary"
                    onClick={() => navigate(`/pacotes/${pkg.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showResults && activeService === "onibus" && (
          <div className="md-result-list">
            {filteredBuses.map((bus) => (
              <article key={bus.id} className="md-result-card">
                <div className="md-result-title-row">
                  <div className="md-result-title">
                    {bus.originCity} → {bus.destinationCity}
                  </div>
                  <div className="md-result-price">
                    {calculateTotalPrice(bus.price, peopleValue.adults, peopleValue.children).totalFormatted}
                  </div>
                </div>
                <div className="md-result-subtitle">
                  {bus.company} · {bus.durationHours}h de viagem
                </div>
                {dateRangeDisplay && (
                  <div className="md-result-meta">
                    Período selecionado: {dateRangeDisplay}
                  </div>
                )}
                {peopleDisplay && (
                  <div className="md-result-meta">Passageiros: {peopleDisplay}</div>
                )}
                <div className="md-result-actions">
                  <button
                    type="button"
                    className="md-details-primary"
                    onClick={() => navigate(`/onibus/${bus.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showResults && activeService === "passeios" && showHighlightResults && (
          <div className="md-result-list">
            <div className="md-highlights-header">
              <div className="md-highlights-title">Destaques para você</div>
              <div className="md-highlights-subtitle">
                Passeios populares com condições especiais para você aproveitar.
              </div>
            </div>
            {featuredTours.map((tour) => (
              <article key={tour.id} className="md-result-card">
                <TourMedia src={tour.imageUrl} alt={tour.title} />
                <div className="md-result-title-row">
                  <div className="md-result-title">{tour.title}</div>
                  <div className="md-result-price">
                    {calculateTotalPrice(tour.price, peopleValue.adults, peopleValue.children).totalFormatted}
                  </div>
                </div>
                <div className="md-result-subtitle">
                  {tour.city}, {tour.country}
                </div>
                <div className="md-result-meta">
                  <span>
                    {tour.experienceType}
                  </span>
                  {tour.badge && (
                    <span className="md-result-badge">{tour.badge}</span>
                  )}
                </div>
                <div className="md-result-actions">
                  <button
                    type="button"
                    className="md-details-primary"
                    onClick={() => navigate(`/passeios/${tour.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showResults && activeService === "passeios" && !showHighlightResults && (
          <div className="md-result-list">
            {filteredTours.length === 0 && (
              <div className="md-empty-card">
                <div className="md-empty-title">Nenhum passeio encontrado</div>
                <p className="md-empty-subtitle">
                  Tente ajustar o destino ou o período para ver novas opções.
                </p>
              </div>
            )}
            {filteredTours.map((tour) => (
              <article key={tour.id} className="md-result-card">
                <TourMedia src={tour.imageUrl} alt={tour.title} />
                <div className="md-result-title-row">
                  <div className="md-result-title">{tour.title}</div>
                  <div className="md-result-price">
                    {calculateTotalPrice(tour.price, peopleValue.adults, peopleValue.children).totalFormatted}
                  </div>
                </div>
                <div className="md-result-subtitle">
                  {tour.city}, {tour.country} · {tour.durationHours}h de duração
                </div>
                <div className="md-result-meta">
                  <span>
                    {tour.experienceType}
                  </span>
                  <span>· Total para {peopleValue.adults + peopleValue.children} {peopleValue.adults + peopleValue.children === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>
                <div className="md-result-description">{tour.description}</div>
                {dateRangeDisplay && (
                  <div className="md-result-meta">
                    Período do passeio: {dateRangeDisplay}
                  </div>
                )}
                {peopleDisplay && (
                  <div className="md-result-meta">Viajantes: {peopleDisplay}</div>
                )}
                <div className="md-result-actions">
                  <button
                    type="button"
                    className="md-details-primary"
                    onClick={() => navigate(`/passeios/${tour.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default SearchScreen;
