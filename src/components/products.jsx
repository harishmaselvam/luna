
import { useEffect, useState } from 'react';
import './products.css';

const products = [
  {
    id: 'rose-midi-dress',
    name: 'Rose midi dress',
    price: 1000,
    image: '/images/rose-dress.webp',
    collection: 'Clothing',
    size: 'M',
    condition: 'Very good',
    description: 'A graceful dress with a soft, romantic look for special moments.'
  },
  {
    id: 'classic-brown-coord',
    name: 'Classic brown co-ord',
    price: 1199,
    image: '/images/classic-brown.webp',
    collection: 'Clothing',
    size: 'S',
    condition: 'Like new',
    description: 'A rich brown look that brings a polished finish to everyday dressing.'
  },
  {
    id: 'beige-kurta-shawl',
    name: 'Beige kurta with floral shawl',
    price: 1299,
    image: '/images/beige-kurtha.webp',
    collection: 'Clothing',
    size: 'L',
    condition: 'Very good',
    description: 'A traditional-inspired beige kurtha paired with a floral shawl.'
  },
  {
    id: 'printed-occasion-dress',
    name: 'Printed occasion dress',
    price: 1699,
    image: '/images/tesflawless.webp',
    collection: 'Clothing',
    size: 'M',
    condition: 'Like new',
    description: 'A standout look made for days when you want to make an impression.'
  },
  {
    id: 'midnight-occasion-dress',
    name: 'Midnight occasion dress',
    price: 999,
    image: '/images/midnight-chic.webp',
    collection: 'Clothing',
    size: 'S',
    condition: 'Good',
    description: 'A dark, elegant style that transitions easily from day to evening.'
  },
  {
    id: 'mayuri-festive-set',
    name: 'Mayuri festive set',
    price: 1499,
    image: '/images/mayuri.webp',
    collection: 'Clothing',
    size: 'L',
    condition: 'Very good',
    description: 'A statement piece with a graceful, occasion-ready feel.'
  }
];

function Products({
  onAddToBag,
  sellerListings = [],
  listingError = '',
  heading = 'New Arrivals',
  eyebrow = 'CURATED JUST FOR YOU'
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!selectedProduct) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedProduct(null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [selectedProduct]);

  const handleQuickAdd = (event) => {
    event.preventDefault();
    onAddToBag(selectedProduct, selectedSize);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  const allProducts = [...sellerListings, ...products];
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? allProducts.filter((product) =>
        [
          product.name,
          product.collection,
          product.condition,
          product.size,
          product.description
        ].some((value) => value?.toLowerCase().includes(normalizedSearch))
      )
    : allProducts;

  return (
    <section className="products-section" id="shop">
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{heading}</h2>
      </div>

      <div className="shop-search">
        <label htmlFor="shop-search-input">Find your next favourite</label>
        <input
          id="shop-search-input"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by item, category, size, or condition"
        />
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}</span>
      </div>

      {listingError && <p role="alert">{listingError}</p>}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id || product.name}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <span className="product-condition">{product.condition || 'Pre-loved'}</span>
              <button
                className="quick-view-button"
                type="button"
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize('');
                }}
              >
                QUICK VIEW
              </button>
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-size">{product.size ? `Size ${product.size} · ` : ''}{product.collection}</p>
              <p>₹{product.price.toLocaleString('en-IN')}</p>
              <button
                className="add-button"
                onClick={() => onAddToBag(product)}
              >
                ADD TO BAG +
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <p className="shop-no-results">No pieces match “{searchTerm}”. Try another search.</p>
      )}

      {selectedProduct && (
        <div
          className="quick-view-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProduct(null);
          }}
        >
          <section
            className="quick-view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
          >
            <button
              className="quick-view-close"
              type="button"
              aria-label="Close quick view"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <div className="quick-view-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="quick-view-details">
              <span className="quick-view-eyebrow">{selectedProduct.condition || 'PRE-LOVED'} · {selectedProduct.size ? `SIZE ${selectedProduct.size}` : 'ONE OF A KIND'}</span>
              <h2 id="quick-view-title">{selectedProduct.name}</h2>
              <p className="quick-view-price">
                ₹{selectedProduct.price.toLocaleString('en-IN')}
              </p>
              <p className="quick-view-description">{selectedProduct.description}</p>

              <form onSubmit={handleQuickAdd}>
                <label htmlFor="product-size">Size</label>
                <select
                  id="product-size"
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                  required
                >
                  <option value="" disabled>Select a size</option>
                  {[selectedProduct.size || 'One size'].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <button className="quick-view-add" type="submit">
                  ADD TO BAG — ₹{selectedProduct.price.toLocaleString('en-IN')}
                </button>
              </form>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Products;
