import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import BottomTabBar from "./components/BottomTabBar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import TourDetailsScreen from "./screens/TourDetailsScreen.jsx";
import DestinationDetailsScreen from "./screens/DestinationDetailsScreen.jsx";
import FeaturedDestinationsScreen from "./screens/FeaturedDestinationsScreen.jsx";
import FlightDetailsScreen from "./screens/FlightDetailsScreen.jsx";
import BusDetailsScreen from "./components/BusDetailsScreen.jsx";
import PackageDetailsScreen from "./screens/PackageDetailsScreen.jsx";
import HotelDetailsScreen from "./screens/HotelDetailsScreen.jsx";
import TripsScreen from "./screens/TripsScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import SignupScreen from "./screens/SignupScreen.jsx";
import CheckoutScreen from "./screens/CheckoutScreen.jsx";
import PurchaseConfirmationScreen from "./screens/PurchaseConfirmationScreen.jsx";
import TripReviewScreen from "./screens/TripReviewScreen.jsx";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isNavHidden, setIsNavHidden] = useState(false);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("meudestino_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem("meudestino_user", JSON.stringify(user));
      } else {
        window.localStorage.removeItem("meudestino_user");
      }
    } catch {
    }
  }, [user]);

  useEffect(() => {
    try {
      const storedReservations = window.localStorage.getItem(
        "meudestino_reservations"
      );
      if (storedReservations) {
        setReservations(JSON.parse(storedReservations));
      }
    } catch {
      setReservations([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (reservations && reservations.length > 0) {
        window.localStorage.setItem(
          "meudestino_reservations",
          JSON.stringify(reservations)
        );
      } else {
        window.localStorage.removeItem("meudestino_reservations");
      }
    } catch {
    }
  }, [reservations]);

  useEffect(() => {
    // Reset nav visibility when changing routes
    setIsNavHidden(false);
  }, [location.pathname]);

  const path = location.pathname;
  let activeTab = "home";
  if (path.startsWith("/buscar")) activeTab = "buscar";
  else if (path.startsWith("/viagens")) activeTab = "viagens";
  else if (path.startsWith("/perfil")) activeTab = "perfil";

  const handleToggleFavorite = (destination) => {
    if (!destination || !destination.id) return;
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === destination.id);
      if (exists) {
        return prev.filter((item) => item.id !== destination.id);
      }
      return [...prev, destination];
    });
  };

  const handleLogin = (credentials) => {
    const identifier = credentials.identifier?.trim();
    if (!identifier) return;
    const isEmail = identifier.includes("@");
    const baseName = isEmail ? identifier.split("@")[0] : identifier;
    const displayName = credentials.name?.trim() || baseName || "Viajante";
    setUser((prev) => ({
      name: displayName,
      email: isEmail ? identifier : prev?.email || "",
      phone: isEmail ? prev?.phone || "" : identifier,
      password: credentials.password || prev?.password || "",
      language: prev?.language || "Português (Brasil)",
      currency: prev?.currency || "BRL - Real brasileiro",
      notifications:
        prev?.notifications || {
          email: true,
          sms: false,
          push: true,
        },
      theme: prev?.theme || "Claro",
      documentId: prev?.documentId || "",
    }));
    navigate("/perfil");
  };

  const handleSignup = (payload) => {
    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const phone = payload.phone?.trim();
    if (!name || !email || !phone) return;
    setUser({
      name,
      email,
      phone,
      password: payload.password,
      language: "Português (Brasil)",
      currency: "BRL - Real brasileiro",
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      theme: "Claro",
      documentId: "",
    });
    navigate("/perfil");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleUpdateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates,
        notifications: updates.notifications || prev.notifications,
      };
    });
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setFavorites([]);
    setReservations([]);
    navigate("/");
  };

  const handleConfirmReservation = (reservation) => {
    const fullReservation = {
      id: String(Date.now()),
      ...reservation,
    };
    setReservations((prev) => [fullReservation, ...prev]);
    navigate("/compra-confirmada", { state: { reservation: fullReservation } });
  };

  const handleTabChange = (tabId) => {
    if (tabId === "home") navigate("/");
    if (tabId === "buscar") navigate("/buscar");
    if (tabId === "viagens") navigate("/viagens");
    if (tabId === "perfil") navigate("/perfil");
  };

  const handleClientAreaClick = () => {
    if (user) {
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  };

  return (
    <LanguageProvider>
      <div className={`md-app ${isNavHidden ? 'md-nav-hidden' : ''}`}>
        <ScrollToTop />
        {!isNavHidden && <Header user={user} onClientAreaClick={handleClientAreaClick} />}
        <main className="md-main">
          <div className="md-shell">
            <div key={path} className="md-page md-page-enter">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomeScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/buscar"
                  element={
                    <SearchScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/destinos-destaque"
                  element={
                    <FeaturedDestinationsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/viagens"
                  element={
                    <TripsScreen
                      favorites={favorites}
                      reservations={reservations}
                      onToggleFavorite={handleToggleFavorite}
                      onSheetStateChange={setIsNavHidden}
                    />
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProfileScreen
                      user={user}
                      favoritesCount={favorites.length}
                      reservationsCount={reservations.length}
                      reservations={reservations}
                      onLogout={handleLogout}
                      onUpdateUser={handleUpdateUser}
                      onDeleteAccount={handleDeleteAccount}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={<LoginScreen onLogin={handleLogin} user={user} />}
                />
                <Route
                  path="/cadastro"
                  element={<SignupScreen onSignup={handleSignup} user={user} />}
                />
                <Route
                  path="/destinos/:id"
                  element={
                    <DestinationDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                      onReserve={(payload) =>
                        handleConfirmReservation({
                          ...payload,
                          source: "details",
                        })
                      }
                    />
                  }
                />
                <Route
                  path="/passeios/:id"
                  element={
                    <TourDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/hoteis/:id"
                  element={
                    <HotelDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/voos/:id"
                  element={
                    <FlightDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/onibus/:id"
                  element={
                    <BusDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/pacotes/:id"
                  element={
                    <PackageDetailsScreen
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <CheckoutScreen
                      user={user}
                      onConfirmReservation={(payload) =>
                        handleConfirmReservation({
                          ...payload,
                          source: "checkout",
                        })
                      }
                    />
                  }
                />
                <Route
                  path="/compra-confirmada"
                  element={<PurchaseConfirmationScreen />}
                />
                <Route
                  path="/avaliar-viagem"
                  element={<TripReviewScreen />}
                />
              </Routes>
            </div>
          </div>
        </main>
        <BottomTabBar 
          activeTab={activeTab} 
          onChange={handleTabChange} 
          isHidden={isNavHidden}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
