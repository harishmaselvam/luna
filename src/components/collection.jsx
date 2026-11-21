
import './collections.css';

const categories = [
  {
    title: 'Clothing',
    image: '/images/clothing.webp'
  },
  {
    title: 'New Season',
    image: '/images/new-season.webp'
  },
  {
    title: 'Essentials',
    image: '/images/essentials.webp'
  }
];

function Collection() {
  return (
    <section className="collection-section" id="collections">
      <div className="section-heading">
        <span>EXPLORE YOUR STYLE</span>
        <h2>Our Collections</h2>
      </div>

      <div className="collection-grid">
        {categories.map((item, index) => (
          <div className="collection-card" key={index}>
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Collection;
