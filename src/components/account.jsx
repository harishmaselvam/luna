import { useEffect, useState } from 'react';
import { getJson, postJson } from '../api';
import './account.css';

function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function Account({ user, onAuthChange, sessionError }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    let active = true;
    getJson('/api/orders')
      .then((result) => {
        if (active) {
          setOrders(result);
          setOrdersError('');
        }
      })
      .catch((error) => {
        if (active) {
          setOrdersError(error instanceof Error ? error.message : 'Unable to load your orders.');
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus('');
    setIsSubmitting(true);

    try {
      const path = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const result = await postJson(path, {
        ...(isRegistering ? {name: formData.get('name')} : {}),
        email: formData.get('email'),
        password: formData.get('password')
      });
      onAuthChange(result.user);
      setStatus('');
      if (sessionStorage.getItem('lunaReturnToCheckout') === 'true') {
        sessionStorage.removeItem('lunaReturnToCheckout');
        window.location.hash = '#/checkout';
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setStatus('');
    try {
      await postJson('/api/auth/logout', {});
      onAuthChange(null);
      setOrders([]);
      setOrdersError('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to log out right now.');
    }
  };

  return (
    <main className="account-page">
      {user ? (
        <section className="account-panel">
          <div className="account-welcome">
            <span className="account-eyebrow">YOUR LUNA ACCOUNT</span>
            <h1>Welcome back, {user.name}.</h1>
            <p>{user.email}</p>
            <div className="account-actions">
              <a className="account-primary-link" href="#/checkout">GO TO CHECKOUT</a>
              <button type="button" className="account-logout" onClick={handleLogout}>LOG OUT</button>
            </div>
          </div>

          <section className="orders-section" aria-labelledby="orders-title">
            <div className="orders-heading">
              <div>
                <span className="account-eyebrow">YOUR PURCHASES</span>
                <h2 id="orders-title">Orders</h2>
              </div>
              <a href="#/shop">CONTINUE SHOPPING</a>
            </div>
            {ordersError && <p className="account-status" role="alert">{ordersError}</p>}
            {!ordersError && orders.length === 0 ? (
              <p className="orders-empty">Your next pre-loved find will appear here.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-heading">
                      <div>
                        <span>ORDER {order.id.slice(-8).toUpperCase()}</span>
                        <p>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</p>
                      </div>
                      <strong>{order.status}</strong>
                    </div>
                    <div className="order-card-items">
                      {order.items.map((item, index) => (
                        <p key={`${item.productId}-${index}`}>{item.name} · Size {item.size}</p>
                      ))}
                    </div>
                    <div className="order-card-footer">
                      <span>Cash on delivery</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          {status && <p className="account-status" role="status">{status}</p>}
        </section>
      ) : (
        <section className="account-panel account-auth-panel">
          <span className="account-eyebrow">YOUR LUNA ACCOUNT</span>
          <h1>{isRegistering ? 'Join LUNA.' : 'Welcome back.'}</h1>
          <p>{isRegistering
            ? 'Create an account to check out and keep track of your orders.'
            : 'Log in to check out and see your orders.'}</p>
          {sessionError && <p className="account-status" role="status">{sessionError}</p>}
          <form className="account-auth-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <label htmlFor="account-name">Full name</label>
                <input id="account-name" name="name" type="text" autoComplete="name" maxLength="100" required />
              </>
            )}
            <label htmlFor="account-email">Email address</label>
            <input id="account-email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="account-password">Password</label>
            <input
              id="account-password"
              name="password"
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength="8"
              maxLength="128"
              required
            />
            {isRegistering && <small className="password-hint">Use at least 8 characters.</small>}
            {status && <p className="account-status" role="alert">{status}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'PLEASE WAIT…' : isRegistering ? 'CREATE ACCOUNT' : 'LOG IN'}
            </button>
          </form>
          <p className="account-switch">
            {isRegistering ? 'Already have an account?' : 'New to LUNA?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setStatus('');
              }}
            >
              {isRegistering ? 'Log in' : 'Create an account'}
            </button>
          </p>
        </section>
      )}
    </main>
  );
}

export default Account;
