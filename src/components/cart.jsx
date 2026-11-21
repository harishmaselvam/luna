import { useEffect } from 'react';
import './cart.css';

function Cart({ items, onClose, onRemove, onCheckout }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div
      className="cart-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="cart-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">YOUR LUNA BAG</span>
            <h2 id="cart-title">Shopping Bag ({items.length})</h2>
          </div>
          <button
            className="cart-close"
            type="button"
            aria-label="Close shopping bag"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your bag is ready for its first pre-loved find.</p>
            <button type="button" onClick={onClose}>CONTINUE SHOPPING</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, index) => (
                <article className="cart-item" key={`${item.name}-${index}`}>
                  <img src={item.image} alt="" />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    {item.size && <p>Size: {item.size}</p>}
                    <p>₹{item.price.toLocaleString('en-IN')}</p>
                    <button type="button" onClick={() => onRemove(index)}>
                      REMOVE
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-total">
              <span>Subtotal</span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>
            <p className="cart-shipping-note">Place your order securely and pay cash on delivery.</p>
            <button className="cart-checkout" type="button" onClick={onCheckout}>
              CHECKOUT
            </button>
            <button className="cart-continue" type="button" onClick={onClose}>
              CONTINUE SHOPPING
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default Cart;
