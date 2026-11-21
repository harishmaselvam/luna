import { useState } from 'react';
import { postJson } from '../api';
import './checkout.css';

function Checkout({ items, user, onOrderPlaced }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [order, setOrder] = useState(null);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus('');
    setIsSubmitting(true);

    try {
      const result = await postJson('/api/orders', {
        items: items.map((item) => ({productId: item.id, size: item.size})),
        shippingAddress: {
          name: formData.get('name'),
          phone: formData.get('phone'),
          street: formData.get('street'),
          city: formData.get('city'),
          state: formData.get('state'),
          postalCode: formData.get('postalCode')
        }
      });
      setOrder(result.order);
      onOrderPlaced();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to place your order right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (order) {
    return (
      <main className="checkout-page">
        <section className="checkout-panel checkout-confirmation">
          <span className="checkout-eyebrow">THANK YOU FOR CHOOSING PRE-LOVED</span>
          <h1>Your order is in.</h1>
          <p>Order {order.id.slice(-8).toUpperCase()} is confirmed. Pay cash when it arrives.</p>
          <a className="checkout-submit" href="#/account">VIEW YOUR ORDERS</a>
        </section>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="checkout-page">
        <section className="checkout-panel checkout-empty">
          <span className="checkout-eyebrow">YOUR LUNA BAG</span>
          <h1>Your bag is empty.</h1>
          <p>Find a pre-loved favourite to get started.</p>
          <a className="checkout-submit" href="#/shop">SHOP PRE-LOVED</a>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span className="checkout-eyebrow">A SECOND LIFE, ON ITS WAY</span>
        <h1>Checkout</h1>
        <p>Signed in as {user.email}</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-panel checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          <label htmlFor="delivery-name">Full name</label>
          <input id="delivery-name" name="name" type="text" autoComplete="name" defaultValue={user.name} maxLength="100" required />
          <label htmlFor="delivery-phone">Phone number</label>
          <input id="delivery-phone" name="phone" type="tel" autoComplete="tel" maxLength="30" required />
          <label htmlFor="delivery-street">Address</label>
          <textarea id="delivery-street" name="street" autoComplete="street-address" rows="3" maxLength="200" required />
          <div className="checkout-address-row">
            <div>
              <label htmlFor="delivery-city">City</label>
              <input id="delivery-city" name="city" autoComplete="address-level2" maxLength="100" required />
            </div>
            <div>
              <label htmlFor="delivery-state">State</label>
              <input id="delivery-state" name="state" autoComplete="address-level1" maxLength="100" required />
            </div>
          </div>
          <label htmlFor="delivery-postal">PIN code</label>
          <input id="delivery-postal" name="postalCode" autoComplete="postal-code" inputMode="numeric" maxLength="12" required />
          {status && <p className="checkout-status" role="alert">{status}</p>}
          <button className="checkout-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'PLACING ORDER…' : 'PLACE CASH ON DELIVERY ORDER'}
          </button>
        </form>

        <aside className="checkout-panel checkout-summary">
          <h2>Your order</h2>
          <div className="checkout-summary-items">
            {items.map((item, index) => (
              <div className="checkout-summary-item" key={`${item.id || item.name}-${index}`}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <span>Size {item.size}</span>
                </div>
                <strong>₹{item.price.toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <p className="checkout-payment-note">Payment method: Cash on delivery</p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
