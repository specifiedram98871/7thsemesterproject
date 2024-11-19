import React from 'react';
import '../CSSForFooter/press.css';

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: "Shopease Launches New AI-Powered Shopping Feature",
      date: "September 12, 2024",
      description: "Shopease introduces AI-driven shopping assistant to enhance customer experience.",
      link: "#"
    },
    {
      id: 2,
      title: "Shopease Ranked Among Top 10 E-commerce Platforms of 2024",
      date: "August 5, 2024",
      description: "Shopease has been recognized as one of the best e-commerce platforms by E-Commerce Times.",
      link: "#"
    },
    {
      id: 3,
      title: "Shopease Partners with Local Artists to Launch Handmade Collection",
      date: "July 20, 2024",
      description: "Supporting local artists, Shopease is launching a unique collection of handmade goods.",
      link: "#"
    }
  ];

  return (
    <div className="press-container">
      <br></br>
      <h1>Press & Media</h1>
      <p>See the latest news and updates about Shopease in the media.</p>
      <div className="press-grid">
        {pressReleases.map((release) => (
          <div key={release.id} className="press-card">
            <h3>{release.title}</h3>
            <p className="date">{release.date}</p>
            <p>{release.description}</p>
            <a href={release.link} target="_blank" rel="noopener noreferrer" className="read-more">
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Press;
