
import './hero.css';

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-tag">PRE-LOVED. RE-LOVED.</span>
          <h1>Give great clothes another go.</h1>

          <p>
            Find your next favourite in someone else’s wardrobe, or pass on a
            piece that deserves another story.
          </p>

          <div className="hero-actions">
            <a href="#/shop" className="hero-button">
              SHOP PRE-LOVED
            </a>
            <a href="#/sell" className="hero-button hero-button-secondary">
              SELL AN ITEM
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
