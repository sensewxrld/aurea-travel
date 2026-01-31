import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconStarFull, IconCheckCircle } from "../components/Icons.jsx";

function TripReviewScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/viagens");
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <section className="md-section">
        <div className="md-status-card" style={{ marginTop: 40, textAlign: 'center' }}>
          <div className="md-status-icon" style={{ margin: '0 auto 16px', width: 64, height: 64 }}>
            <IconCheckCircle width={32} height={32} />
          </div>
          <h2 className="md-status-title" style={{ fontSize: 20 }}>Avaliação enviada!</h2>
          <p className="md-status-subtitle">
            Obrigado por compartilhar sua experiência conosco.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="md-section">
      <div className="md-section-header">
        <div>
          <h1 className="md-section-title">Avaliar viagem</h1>
          <p className="md-section-subtitle">
            Conte como foi sua experiência para ajudarmos em próximas viagens.
          </p>
        </div>
      </div>
      <div className="md-rating-card">
        <form onSubmit={handleSubmit} className="md-rating-form">
          <div className="md-rating-header">
            <div className="md-rating-title">Como foi a sua viagem?</div>
            <div className="md-rating-subtitle">
              Sua opinião nos ajuda a oferecer recomendações cada vez mais certeiras.
            </div>
          </div>
          <div className="md-rating-stars">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const isActive = rating >= value;
              return (
                <button
                  key={value}
                  type="button"
                  className={
                    isActive
                      ? "md-rating-star md-rating-star-active"
                      : "md-rating-star"
                  }
                  onClick={() => setRating(value)}
                >
                  <IconStarFull />
                </button>
              );
            })}
          </div>
          <div className="md-field-group">
            <label className="md-field-label" htmlFor="trip-comment">
              Comentário
            </label>
            <textarea
              id="trip-comment"
              className="md-field-input md-rating-textarea"
              placeholder="Compartilhe pontos altos da viagem, melhorias ou sugestões."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
            />
          </div>
          <div className="md-rating-actions">
            <button type="submit" className="md-primary-button">
              Enviar avaliação
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TripReviewScreen;

