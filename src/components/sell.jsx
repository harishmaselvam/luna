import { useState } from 'react';
import './sell.css';

async function optimizePhoto(file) {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare this photo in the browser.');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82);
  } finally {
    bitmap.close();
  }
}

function Sell({ listings, listingError = '', onCreateListing, onDeleteListing }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const imageUrl = values.get('image').trim();
    const selectedFile = values.get('photoFile');
    const photoFile = selectedFile instanceof File && selectedFile.size > 0
      ? selectedFile
      : null;

    setMessage('');
    setError('');

    if (imageUrl && photoFile) {
      setError('Use either a photo URL or a photo from your device, not both.');
      return;
    }

    if (!imageUrl && !photoFile) {
      setError('Add a photo URL or choose a photo from your device.');
      return;
    }

    if (photoFile && !photoFile.type.startsWith('image/')) {
      setError('Choose a valid image file.');
      return;
    }

    if (photoFile && photoFile.size > 15 * 1024 * 1024) {
      setError('Choose an image smaller than 15 MB.');
      return;
    }

    let image = imageUrl;
    if (photoFile) {
      try {
        image = await optimizePhoto(photoFile);
      } catch {
        setError('This photo could not be opened. Try another image file.');
        return;
      }
    }

    const listing = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: values.get('name').trim(),
      collection: values.get('category'),
      size: values.get('size'),
      condition: values.get('condition'),
      price: Number(values.get('price')),
      description: values.get('description').trim(),
      image
    };

    try {
      await onCreateListing(listing);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to publish your item right now.');
      return;
    }

    form.reset();
    setMessage('Your item is live in the shop. Thanks for giving it a second life!');
  };

  const handleDelete = async (listing) => {
    setError('');
    setMessage('');
    try {
      await onDeleteListing(listing.id);
      setMessage('Your listing was deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this listing right now.');
    }
  };

  return (
    <main className="sell-page">
      <section className="sell-intro">
        <span>SELL WITH LUNA</span>
        <h1>Someone else is going to love it.</h1>
        <p>List a piece from your wardrobe and give it a new home. It only takes a minute.</p>
      </section>

      <section className="sell-content">
        <form className="sell-form" onSubmit={handleSubmit}>
          <h2>Tell us about your piece</h2>
          <label htmlFor="listing-name">Item name</label>
          <input id="listing-name" name="name" placeholder="e.g. Linen summer dress" required maxLength="70" />

          <div className="sell-form-row">
            <div>
              <label htmlFor="listing-category">Category</label>
              <select id="listing-category" name="category" required defaultValue="">
                <option value="" disabled>Choose one</option>
                <option value="Clothing">Clothing</option>
                <option value="Shoes">Shoes</option>
                <option value="Accessories">Accessories</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
            <div>
              <label htmlFor="listing-size">Size</label>
              <select id="listing-size" name="size" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {['XS', 'S', 'M', 'L', 'XL', 'One size'].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sell-form-row">
            <div>
              <label htmlFor="listing-condition">Condition</label>
              <select id="listing-condition" name="condition" required defaultValue="">
                <option value="" disabled>Choose one</option>
                <option value="Like new">Like new</option>
                <option value="Very good">Very good</option>
                <option value="Good">Good</option>
              </select>
            </div>
            <div>
              <label htmlFor="listing-price">Price (₹)</label>
              <input id="listing-price" name="price" type="number" min="1" step="1" placeholder="750" required />
            </div>
          </div>

          <label htmlFor="listing-description">A few details</label>
          <textarea id="listing-description" name="description" rows="4" maxLength="300" placeholder="Fit, fabric, or anything else a buyer should know" required />

          <label htmlFor="listing-image">Photo URL</label>
          <input id="listing-image" name="image" type="url" placeholder="https://..." />
          <label htmlFor="listing-photo">Or choose a photo from this device</label>
          <input id="listing-photo" name="photoFile" type="file" accept="image/*" />
          <p className="sell-photo-note">Choose one photo source. Device photos are resized and saved with your listing in MongoDB.</p>
          <p className="sell-demo-note">Listings are saved in MongoDB. Until seller accounts are added, this browser represents your seller profile. Checkout and shipping are not connected yet.</p>
          <button type="submit">PUBLISH MY ITEM</button>
          {error && <p className="sell-error" role="alert">{error}</p>}
          <p className="sell-success" role="status">{message}</p>
        </form>

        <aside className="seller-listings">
          <span>YOUR SELLER SPACE</span>
          <h2>{listings.length ? 'Your live listings' : 'Your wardrobe, re-loved.'}</h2>
          {listingError && <p className="sell-error" role="alert">{listingError}</p>}
          {listings.length ? (
            <ul>
              {listings.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <strong>₹{item.price.toLocaleString('en-IN')}</strong>
                  <button
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    onClick={() => {
                      if (window.confirm(`Delete "${item.name}" from the shop?`)) {
                        handleDelete(item);
                      }
                    }}
                  >
                    DELETE
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your published pieces will show up here and in the buyer shop.</p>
          )}
          <a href="#/shop">SEE WHAT BUYERS SEE →</a>
        </aside>
      </section>
    </main>
  );
}

export default Sell;
