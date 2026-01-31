import React, { useState, useRef, useEffect } from "react";
import { IconSearch, IconChevronDown } from "./Icons.jsx";

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

const formatDateForDisplay = (value) => {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
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

const serviceConfig = {
  passeios: {
    title: "Buscar passeios",
    subtitle: "Tours guiados, experiências locais e ingressos oficiais.",
    destinationPlaceholder: "Destino ou atração",
    datePlaceholder: "Data do passeio",
    peoplePlaceholder: "Quantidade de pessoas",
    chips: [
      "Passeios mais vendidos",
      "Ingressos sem fila",
      "Experiências exclusivas",
    ],
  },
  voos: {
    title: "Buscar voos",
    subtitle: "Compare companhias, horários e tarifas flexíveis.",
    destinationPlaceholder: "Cidade ou aeroporto",
    datePlaceholder: "Datas de ida e volta",
    peoplePlaceholder: "Passageiros e classe",
    chips: ["Tarifas flexíveis", "Multidestinos", "Companhias preferidas"],
  },
  hoteis: {
    title: "Buscar hotéis",
    subtitle: "Hotéis selecionados para cada estilo de viagem.",
    destinationPlaceholder: "Cidade ou hotel",
    datePlaceholder: "Check-in e check-out",
    peoplePlaceholder: "Hóspedes e quartos",
    chips: ["Cancelamento grátis", "Café da manhã incluso", "Avaliações altas"],
  },
  pacotes: {
    title: "Buscar pacotes",
    subtitle: "Voo + hotel com condições especiais.",
    destinationPlaceholder: "Destino do pacote",
    datePlaceholder: "Datas de viagem",
    peoplePlaceholder: "Viajantes",
    chips: ["Economize até 30%", "Tudo em um só lugar", "Parcelamento"],
  },
  onibus: {
    title: "Buscar ônibus",
    subtitle: "Rotas rodoviárias com conforto e segurança.",
    destinationPlaceholder: "Origem e destino",
    datePlaceholder: "Data de partida",
    peoplePlaceholder: "Passageiros",
    chips: ["Viaje leve", "Poltronas reclináveis", "Empresas confiáveis"],
  },
};

function SearchCard({
  activeService,
  destinationValue,
  dateStartValue,
  dateEndValue,
  peopleValue,
  destinationError,
  dateError,
  onDestinationChange,
  onDateStartChange,
  onDateEndChange,
  onPeopleChange,
  onSubmit,
}) {
  const config = serviceConfig[activeService] || serviceConfig.passeios;
  const initialReferenceDate = parseIsoDate(dateStartValue) || new Date();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    initialReferenceDate.getMonth()
  );
  const [calendarYear, setCalendarYear] = useState(
    initialReferenceDate.getFullYear()
  );
  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [peoplePopoverOpensUp, setPeoplePopoverOpensUp] = useState(false);
  const calendarContainerRef = useRef(null);
  const peopleContainerRef = useRef(null);
  const peopleFieldRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isCalendarOpen &&
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
      if (
        isPeopleOpen &&
        peopleContainerRef.current &&
        !peopleContainerRef.current.contains(event.target)
      ) {
        setIsPeopleOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen, isPeopleOpen]);

  const startDate = parseIsoDate(dateStartValue);
  const endDate = parseIsoDate(dateEndValue);
  const calendarDays = buildCalendarDays(calendarYear, calendarMonth);
  const startDisplay = formatDateForDisplay(dateStartValue);
  const endDisplay = formatDateForDisplay(dateEndValue);
  const adults = peopleValue?.adults ?? 1;
  const children = peopleValue?.children ?? 0;
  const peopleSummary = (() => {
    const parts = [];
    if (typeof adults === "number" && adults > 0) {
      parts.push(`${adults} ${adults === 1 ? "adulto" : "adultos"}`);
    }
    if (typeof children === "number" && children > 0) {
      parts.push(`${children} ${children === 1 ? "criança" : "crianças"}`);
    }
    return parts.join(", ");
  })();

  const handleToggleCalendar = () => {
    setIsCalendarOpen((open) => !open);
  };

  const handleTogglePeople = () => {
    if (peopleFieldRef.current) {
      const rect = peopleFieldRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight || 0;
      const estimatedPopoverHeight = 220;
      const spaceBelow = viewportHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < estimatedPopoverHeight;
      setPeoplePopoverOpensUp(shouldOpenUp);
    }
    setIsPeopleOpen((open) => !open);
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
      onDateStartChange?.(iso);
      onDateEndChange?.("");
      return;
    }
    if (date.getTime() < startDate.getTime()) {
      const newStart = toIsoDate(date);
      const newEnd = toIsoDate(startDate);
      onDateStartChange?.(newStart);
      onDateEndChange?.(newEnd);
      setIsCalendarOpen(false);
      return;
    }
    const isoEnd = toIsoDate(date);
    onDateEndChange?.(isoEnd);
    setIsCalendarOpen(false);
  };

  const handleClearDates = () => {
    onDateStartChange?.("");
    onDateEndChange?.("");
  };

  const handleAdultsChange = (value) => {
    const nextAdults = Math.max(1, value);
    const nextChildren = Math.max(0, children);
    onPeopleChange?.({
      adults: nextAdults,
      children: nextChildren,
    });
  };

  const handleChildrenChange = (value) => {
    const nextChildren = Math.max(0, value);
    const nextAdults = Math.max(1, adults);
    onPeopleChange?.({
      adults: nextAdults,
      children: nextChildren,
    });
  };

  return (
    <div className="md-search-card">
      <div className="md-search-header">
        <div>
          <div className="md-search-title">{config.title}</div>
          <div className="md-search-subtitle">{config.subtitle}</div>
        </div>
        <div className="md-badge-pill">Melhores tarifas em tempo real</div>
      </div>
      <div className="md-search-grid">
        <div className="md-field-group">
          <label className="md-field-label" htmlFor="destino">
            Destino
          </label>
          <input
            id="destino"
            className={
              destinationError
                ? "md-field-input md-field-input-error"
                : "md-field-input"
            }
            placeholder={config.destinationPlaceholder}
            value={destinationValue}
            onChange={(event) => onDestinationChange?.(event.target.value)}
          />
          {destinationError && (
            <div className="md-field-error">{destinationError}</div>
          )}
        </div>
        <div className="md-field-group" ref={calendarContainerRef}>
          <label className="md-field-label" htmlFor="datas">
            Datas
          </label>
          <div className="md-field-inline">
            <button
              type="button"
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
              className={
                endDisplay
                  ? "md-date-pill"
                  : "md-date-pill md-date-pill-placeholder"
              }
              onClick={handleToggleCalendar}
            >
              <span className="md-date-pill-label">Volta</span>
              <span className="md-date-pill-value">
                {endDisplay || "Opcional"}
              </span>
            </button>
          </div>
          {dateError && <div className="md-field-error">{dateError}</div>}
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
        <div className="md-field-group" ref={peopleContainerRef}>
          <label className="md-field-label" htmlFor="pessoas-trigger">
            Viajantes
          </label>
          <div className="md-people-field" ref={peopleFieldRef}>
            <button
              id="pessoas-trigger"
              type="button"
              className="md-people-trigger"
              onClick={handleTogglePeople}
              aria-expanded={isPeopleOpen ? "true" : "false"}
            >
              <div className="md-people-trigger-text">
                <span className="md-people-trigger-label">
                  Adultos e crianças
                </span>
                <span
                  className={
                    peopleSummary
                      ? "md-people-trigger-value"
                      : "md-people-trigger-placeholder"
                  }
                >
                  {peopleSummary || "Selecione viajantes"}
                </span>
              </div>
              <span className="md-people-trigger-icon">
                <IconChevronDown />
              </span>
            </button>
            {isPeopleOpen && (
              <div
                className={
                  peoplePopoverOpensUp
                    ? "md-people-popover md-people-popover-up"
                    : "md-people-popover"
                }
              >
                <div className="md-people-row">
                  <div className="md-people-row-label">
                    <div className="md-people-row-title">Adultos</div>
                    <div className="md-people-row-subtitle">
                      13 anos ou mais
                    </div>
                  </div>
                  <div className="md-people-options">
                    {[...Array(10)].map((_, index) => {
                      const value = index + 1;
                      const optionClass =
                        value === adults
                          ? "md-people-option md-people-option-selected"
                          : "md-people-option";
                      return (
                        <button
                          key={value}
                          type="button"
                          className={optionClass}
                          onClick={() => handleAdultsChange(value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="md-people-row">
                  <div className="md-people-row-label">
                    <div className="md-people-row-title">Crianças</div>
                    <div className="md-people-row-subtitle">0 a 12 anos</div>
                  </div>
                  <div className="md-people-options">
                    {[...Array(10)].map((_, index) => {
                      const value = index;
                      const optionClass =
                        value === children
                          ? "md-people-option md-people-option-selected"
                          : "md-people-option";
                      return (
                        <button
                          key={value}
                          type="button"
                          className={optionClass}
                          onClick={() => handleChildrenChange(value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md-field-group">
          <span className="md-field-label">&nbsp;</span>
          <button
            className="md-primary-button"
            type="button"
            onClick={onSubmit}
          >
            <span className="md-primary-button-icon">
              <IconSearch />
            </span>
            <span>Explorar opções</span>
          </button>
        </div>
      </div>
      <div className="md-chip-row">
        {config.chips.map((chip) => (
          <div key={chip} className="md-chip md-chip-strong">
            {chip}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchCard;
