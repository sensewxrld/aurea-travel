import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect.jsx";

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const parseIsoDate = (value) => {
  if (!value || typeof value !== "string") return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const year = Number(parts[0]);
  const monthIndex = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  if (!year || Number.isNaN(monthIndex) || Number.isNaN(day)) return null;
  return new Date(year, monthIndex, day);
};

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildCalendarDays = (year, monthIndex) => {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();
  const days = [];
  for (let i = 0; i < startWeekday; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, monthIndex, day));
  }
  return days;
};

const isSameDate = (a, b) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const isWithinRange = (date, start, end) => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

function CheckoutScreen({ user, onConfirmReservation }) {
  const location = useLocation();
  const navigate = useNavigate();

  const destination = useMemo(() => {
    if (location.state && location.state.destination) {
      return location.state.destination;
    }
    return (
      location.state?.fallbackDestination || {
        id: "rio",
        name: "Rio de Janeiro",
        price: "R$ 899",
      }
    );
  }, [location.state]);

  const [dateStart, setDateStart] = useState(
    location.state?.searchDates?.start || ""
  );
  const [dateEnd, setDateEnd] = useState(
    location.state?.searchDates?.end || ""
  );
  const [people, setPeople] = useState(
    location.state?.searchPeople || { adults: 2, children: 0 }
  );
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [pixName, setPixName] = useState(user?.name || "");
  const [datesError, setDatesError] = useState("");
  const [cardNameError, setCardNameError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [cardCvvError, setCardCvvError] = useState("");
  const [pixNameError, setPixNameError] = useState("");

  const initialReferenceDate = parseIsoDate(dateStart) || new Date();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    initialReferenceDate.getMonth()
  );
  const [calendarYear, setCalendarYear] = useState(
    initialReferenceDate.getFullYear()
  );

  const startDate = parseIsoDate(dateStart);
  const endDate = parseIsoDate(dateEnd);
  const calendarDays = buildCalendarDays(calendarYear, calendarMonth);

  const onlyDigits = (value) => value.replace(/\D/g, "");

  const formatCardNumber = (value) => {
    const digits = onlyDigits(value).slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const isValidCardNumber = (value) => {
    const digits = onlyDigits(value);
    return /^[0-9]{13,19}$/.test(digits);
  };

  const formatExpiry = (value) => {
    const digits = onlyDigits(value).slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isValidExpiry = (value) => {
    const digits = onlyDigits(value);
    if (digits.length !== 4) return false;
    const month = parseInt(digits.slice(0, 2), 10);
    const year = parseInt(digits.slice(2, 4), 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };

  const formatCvv = (value) => {
    return onlyDigits(value).slice(0, 4);
  };

  const isValidCvv = (value) => /^\d{3,4}$/.test(onlyDigits(value));

  const sanitizeCardholderName = (value) =>
    value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

  const isValidCardholderName = (value) =>
    /^[A-Za-zÀ-ÿ\s]+$/.test(value.trim());

  const formatDateForDisplay = (value) => {
    if (!value) return "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const startDisplay = formatDateForDisplay(dateStart);
  const endDisplay = formatDateForDisplay(dateEnd);

  const datesDisplay =
    dateStart && dateEnd
      ? `${formatDateForDisplay(dateStart)} → ${formatDateForDisplay(dateEnd)}`
      : "";

  const handleToggleCalendar = () => {
    setIsCalendarOpen((open) => !open);
  };

  const handleChangeMonth = (delta) => {
    setCalendarMonth((prevMonth) => {
      let nextMonth = prevMonth + delta;
      let nextYear = calendarYear;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      } else if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }
      setCalendarYear(nextYear);
      return nextMonth;
    });
  };

  const handleDayClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      const iso = toIsoDate(date);
      setDateStart(iso);
      setDateEnd("");
      setDatesError("");
      return;
    }
    if (date.getTime() < startDate.getTime()) {
      const newStart = toIsoDate(date);
      const newEnd = toIsoDate(startDate);
      setDateStart(newStart);
      setDateEnd(newEnd);
      setIsCalendarOpen(false);
      setDatesError("");
      return;
    }
    const isoEnd = toIsoDate(date);
    setDateEnd(isoEnd);
    setIsCalendarOpen(false);
    setDatesError("");
  };

  const handleClearDates = () => {
    setDateStart("");
    setDateEnd("");
    setDatesError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDatesError("");
    setCardNameError("");
    setCardNumberError("");
    setCardExpiryError("");
    setCardCvvError("");
    setPixNameError("");

    let hasError = false;

    if (!dateStart || !dateEnd) {
      setDatesError("Informe as datas de ida e volta.");
      hasError = true;
    } else if (dateEnd < dateStart) {
      setDatesError("A data de volta não pode ser anterior à data de ida.");
      hasError = true;
    }

    if (paymentMethod === "credit") {
      if (!cardName || !isValidCardholderName(cardName)) {
        setCardNameError("Digite o nome exatamente como no cartão.");
        hasError = true;
      }
      if (!isValidCardNumber(cardNumber)) {
        setCardNumberError("Número do cartão inválido.");
        hasError = true;
      }
      if (!isValidExpiry(cardExpiry)) {
        setCardExpiryError("Validade inválida ou vencida.");
        hasError = true;
      }
      if (!isValidCvv(cardCvv)) {
        setCardCvvError("CVV deve ter 3 ou 4 dígitos.");
        hasError = true;
      }
    }

    if (paymentMethod === "pix") {
      if (!pixName.trim()) {
        setPixNameError("Informe o nome completo do pagador.");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    let serviceType = "outro";
    if (destination.serviceType) {
      serviceType = destination.serviceType;
    } else if (destination.id?.startsWith("flight-")) {
      serviceType = "voo";
    } else if (destination.id?.startsWith("hotel-")) {
      serviceType = "hotel";
    } else if (destination.id?.startsWith("package-")) {
      serviceType = "pacote";
    } else if (destination.id?.startsWith("bus-")) {
      serviceType = "onibus";
    }

    const reservationPayload = {
      destinationId: destination.id,
      destinationName: destination.name,
      price: destination.price,
      dates: datesDisplay || "Datas a definir",
      date_start: dateStart || null,
      date_end: dateEnd || null,
      people,
      customerEmail: user?.email || null,
      customerName: user?.name || null,
      serviceType,
      paymentMethod,
    };

    if (serviceType === "voo" || serviceType === "onibus") {
      reservationPayload.data_ida = dateStart || null;
      reservationPayload.data_volta = dateEnd || null;
    } else if (serviceType === "hotel") {
      reservationPayload.checkin = dateStart || null;
      reservationPayload.checkout = dateEnd || null;
    } else {
      reservationPayload.data_inicio = dateStart || null;
      reservationPayload.data_fim = dateEnd || null;
    }

    onConfirmReservation(reservationPayload);
  };

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Pagamento da viagem</h1>
          <p className="md-section-subtitle">
            Revise os detalhes e escolha a forma de pagamento.
          </p>
        </div>
      </div>
      <div className="md-checkout-card">
        <div className="md-checkout-summary">
          <div className="md-checkout-destination">
            <div className="md-checkout-destination-name">
              {destination.name}
            </div>
            {destination.price && (
              <div className="md-checkout-price">
                <div className="md-checkout-price-total">{destination.price}</div>
                <div className="md-checkout-price-people">
                  Total para {people.adults + people.children} {people.adults + people.children === 1 ? 'pessoa' : 'pessoas'}
                </div>
              </div>
            )}
          </div>
          {datesDisplay && (
            <div className="md-checkout-dates">{datesDisplay}</div>
          )}
          {user && (
            <div className="md-checkout-user">
              <div className="md-checkout-user-label">Viajante</div>
              <div className="md-checkout-user-name">{user.name}</div>
              <div className="md-checkout-user-email">{user.email}</div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="md-checkout-form">
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="checkout-date-start">
              Datas da viagem
            </label>
            <div className="md-field-inline">
              <button
                type="button"
                id="checkout-date-start"
                className={
                  startDisplay
                    ? "md-date-pill"
                    : "md-date-pill md-date-pill-placeholder"
                }
                onClick={handleToggleCalendar}
              >
                <span className="md-date-pill-label">Ida</span>
                <span className="md-date-pill-value">
                  {startDisplay || "Selecione a data de ida"}
                </span>
              </button>
              <button
                type="button"
                id="checkout-date-end"
                className={
                  endDisplay
                    ? "md-date-pill"
                    : "md-date-pill md-date-pill-placeholder"
                }
                onClick={handleToggleCalendar}
              >
                <span className="md-date-pill-label">Volta</span>
                <span className="md-date-pill-value">
                  {endDisplay || "Selecione a data de volta"}
                </span>
              </button>
            </div>
            {datesError && (
              <div className="md-field-error">{datesError}</div>
            )}
            {isCalendarOpen && (
              <div className="md-date-range-popover">
                <div className="md-calendar">
                  <div className="md-calendar-header">
                    <button
                      type="button"
                      className="md-calendar-nav"
                      onClick={() => handleChangeMonth(-1)}
                    >
                      ‹
                    </button>
                    <div className="md-calendar-title">
                      {monthNames[calendarMonth]} {calendarYear}
                    </div>
                    <button
                      type="button"
                      className="md-calendar-nav"
                      onClick={() => handleChangeMonth(1)}
                    >
                      ›
                    </button>
                  </div>
                  <div className="md-calendar-weekdays">
                    {["D", "S", "T", "Q", "Q", "S", "S"].map((label) => (
                      <div key={label} className="md-calendar-weekday">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="md-calendar-grid">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="md-calendar-day md-calendar-day-empty"
                          />
                        );
                      }
                      const isStart = isSameDate(date, startDate);
                      const isEnd = isSameDate(date, endDate);
                      const inRange = isWithinRange(date, startDate, endDate);
                      let dayClass = "md-calendar-day";
                      if (inRange) {
                        dayClass += " md-calendar-day-in-range";
                      }
                      if (isStart || isEnd) {
                        dayClass += " md-calendar-day-selected";
                      }
                      return (
                        <button
                          key={toIsoDate(date)}
                          type="button"
                          className={dayClass}
                          onClick={() => handleDayClick(date)}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  <div className="md-calendar-footer">
                    <button
                      type="button"
                      className="md-calendar-clear"
                      onClick={handleClearDates}
                    >
                      Limpar
                    </button>
                    <button
                      type="button"
                      className="md-calendar-close"
                      onClick={handleToggleCalendar}
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="checkout-people-adultos">
              Viajantes
            </label>
            <div className="md-field-inline">
              <div className="md-select-group">
                <label
                  className="md-select-label"
                  htmlFor="checkout-people-adultos"
                >
                  Adultos
                </label>
                <CustomSelect
                  id="checkout-people-adultos"
                  value={people?.adults ?? 2}
                  options={[...Array(10)].map((_, index) => ({
                    value: index + 1,
                    label: String(index + 1),
                  }))}
                  onChange={(event) => {
                    const nextAdults = parseInt(event.target.value, 10);
                    const nextChildren = people?.children ?? 0;
                    setPeople({
                      adults: nextAdults,
                      children: nextChildren,
                    });
                  }}
                />
              </div>
              <div className="md-select-group">
                <label
                  className="md-select-label"
                  htmlFor="checkout-people-criancas"
                >
                  Crianças
                </label>
                <CustomSelect
                  id="checkout-people-criancas"
                  value={people?.children ?? 0}
                  options={[...Array(10)].map((_, index) => ({
                    value: index,
                    label: String(index),
                  }))}
                  onChange={(event) => {
                    const nextChildren = parseInt(event.target.value, 10);
                    const nextAdults = people?.adults ?? 2;
                    setPeople({
                      adults: nextAdults,
                      children: nextChildren,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="md-field-group">
            <div className="md-field-label">Forma de pagamento</div>
            <div className="md-payment-methods">
              <button
                type="button"
                className={
                  paymentMethod === "credit"
                    ? "md-payment-pill md-payment-pill-active"
                    : "md-payment-pill"
                }
                onClick={() => setPaymentMethod("credit")}
              >
                Cartão de crédito
              </button>
              <button
                type="button"
                className={
                  paymentMethod === "pix"
                    ? "md-payment-pill md-payment-pill-active"
                    : "md-payment-pill"
                }
                onClick={() => setPaymentMethod("pix")}
              >
                Pix (mock)
              </button>
            </div>
          </div>

          {paymentMethod === "credit" && (
            <>
              <div className="md-field-group">
                <label className="md-field-label" htmlFor="card-name">
                  Nome impresso no cartão
                </label>
                <input
                  id="card-name"
                className={
                  cardNameError
                    ? "md-field-input md-field-input-error"
                    : "md-field-input"
                }
                  placeholder="Como aparece no cartão"
                  value={cardName}
                onChange={(event) => {
                  const nextValue = sanitizeCardholderName(
                    event.target.value
                  );
                  setCardName(nextValue);
                  if (nextValue && !isValidCardholderName(nextValue)) {
                    setCardNameError("Use apenas letras e espaços.");
                  } else {
                    setCardNameError("");
                  }
                }}
                />
              {cardNameError && (
                <div className="md-field-error">{cardNameError}</div>
              )}
              </div>
              <div className="md-field-group">
                <label className="md-field-label" htmlFor="card-number">
                  Número do cartão
                </label>
                <input
                  id="card-number"
                className={
                  cardNumberError
                    ? "md-field-input md-field-input-error"
                    : "md-field-input"
                }
                  placeholder="•••• •••• •••• ••••"
                  value={cardNumber}
                onChange={(event) => {
                  const formatted = formatCardNumber(event.target.value);
                  setCardNumber(formatted);
                  if (formatted && !isValidCardNumber(formatted)) {
                    setCardNumberError(
                      "Digite entre 13 e 19 dígitos numéricos."
                    );
                  } else {
                    setCardNumberError("");
                  }
                }}
                inputMode="numeric"
                autoComplete="cc-number"
                />
              {cardNumberError && (
                <div className="md-field-error">{cardNumberError}</div>
              )}
              </div>
              <div className="md-field-inline">
                <div className="md-field-group">
                  <label className="md-field-label" htmlFor="card-expiry">
                    Validade
                  </label>
                  <input
                    id="card-expiry"
                    className={
                      cardExpiryError
                        ? "md-field-input md-field-input-error"
                        : "md-field-input"
                    }
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(event) => {
                      const formatted = formatExpiry(event.target.value);
                      setCardExpiry(formatted);
                      if (formatted && !isValidExpiry(formatted)) {
                        setCardExpiryError(
                          "Informe um mês válido e cartão não vencido."
                        );
                      } else {
                        setCardExpiryError("");
                      }
                    }}
                    inputMode="numeric"
                  />
                  {cardExpiryError && (
                    <div className="md-field-error">{cardExpiryError}</div>
                  )}
                </div>
                <div className="md-field-group">
                  <label className="md-field-label" htmlFor="card-cvv">
                    Código de segurança
                  </label>
                  <input
                    id="card-cvv"
                    className={
                      cardCvvError
                        ? "md-field-input md-field-input-error"
                        : "md-field-input"
                    }
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(event) => {
                      const formatted = formatCvv(event.target.value);
                      setCardCvv(formatted);
                      if (formatted && !isValidCvv(formatted)) {
                        setCardCvvError("Use 3 ou 4 dígitos numéricos.");
                      } else {
                        setCardCvvError("");
                      }
                    }}
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {cardCvvError && (
                    <div className="md-field-error">{cardCvvError}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {paymentMethod === "pix" && (
            <div className="md-field-group">
              <label className="md-field-label" htmlFor="pix-name">
                Nome do pagador
              </label>
              <input
                id="pix-name"
                className={
                  pixNameError
                    ? "md-field-input md-field-input-error"
                    : "md-field-input"
                }
                placeholder="Nome completo"
                value={pixName}
                onChange={(event) => {
                  setPixName(event.target.value);
                  if (pixNameError && event.target.value.trim()) {
                    setPixNameError("");
                  }
                }}
              />
              <div className="md-field-hint">
                Geraremos um QR Code ou chave fictícia apenas para simulação.
              </div>
              {pixNameError && (
                <div className="md-field-error">{pixNameError}</div>
              )}
            </div>
          )}

          <div className="md-checkout-actions">
            <button
              type="button"
              className="md-details-secondary"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>
            <button type="submit" className="md-details-primary">
              Pagar agora
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CheckoutScreen;
