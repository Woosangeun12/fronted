import React from "react";
import "./QuotePage.css";

export default function QuotePage() {
  const movie = {
    title: "La La Land",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  };

  const quote = "별을 향해 춤을 춰요. 언젠간 닿을 수도 있으니까요. 🌟";

  return (
    <div className="quote-container">
      <h1 className="quote-title">마음 처방전</h1>

      <div className="quote-card">
        <img
          src={movie.image}
          alt={movie.title}
          className="quote-image"
        />
        <div className="quote-movie-title">{movie.title}</div>
        <p className="quote-text fade-in">"{quote}"</p>
      </div>
    </div>
  );
}
