
import './about.css';

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900"
          alt="A secondhand fashion look"
        />
      </div>

      <div className="about-content">
        <span>THE LUNA WAY</span>

        <h2>Good style should go around.</h2>

        <p>
          At LUNA, we believe the best wardrobe is one that keeps moving.
          We make it easier to find quality pieces with a past and a future.
          <br />
          <br />
          Shop one-of-a-kind pre-loved finds or sell the pieces you’re ready
          to pass on. Better for your wardrobe, and a little lighter on the planet.
        </p>

        <a href="#/shop" className="about-button">
          FIND YOUR NEXT FAVOURITE
        </a>
      </div>
    </section>
  );
}

export default About;
