
import { useCallback, useEffect, useState } from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import Collection from './components/collection';
import Products from './components/products';
import About from './components/about';
import Newsletter from './components/newsletter';
import Footer from './components/footer';
import Cart from './components/cart';
import Contact from './components/contact';
import Sell from './components/sell';
import Account from './components/account';
import Checkout from './components/checkout';
import { deleteJson, getJson, postJson } from './api';

import './App.css';

function getCurrentPage() {
  if (window.location.hash === '#/collections') return 'collections';
  if (window.location.hash === '#/shop') return 'shop';
  if (window.location.hash === '#/sell') return 'sell';
  if (window.location.hash === '#/contact') return 'contact';
  if (window.location.hash === '#/account') return 'account';
  if (window.location.hash === '#/checkout') return 'checkout';
  return 'home';
}

function getSellerId() {
  const existingId = localStorage.getItem('lunaSellerId');
  if (existingId) return existingId;

  const sellerId = window.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem('lunaSellerId', sellerId);
  return sellerId;
}

function App() {
  const [page, setPage] = useState(getCurrentPage);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem('lunaCart') || '[]')
  );
  const [sellerId] = useState(getSellerId);
  const [sellerListings, setSellerListings] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [listingError, setListingError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authLoadError, setAuthLoadError] = useState('');
  const [joinStatus, setJoinStatus] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  useEffect(() => {
    let active = true;
    getJson('/api/auth/session')
      .then((result) => {
        if (active) {
          setUser(result.user);
          setAuthLoadError('');
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setAuthLoadError('Unable to verify your account session. Please try logging in again.');
        }
      })
      .finally(() => {
        if (active) setIsAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => setPage(getCurrentPage());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (page === 'checkout' && !user) {
      sessionStorage.setItem('lunaReturnToCheckout', 'true');
      window.location.hash = '#/account';
      return;
    }
    if (page === 'account' && user && sessionStorage.getItem('lunaReturnToCheckout') === 'true') {
      sessionStorage.removeItem('lunaReturnToCheckout');
      window.location.hash = '#/checkout';
    }
  }, [isAuthLoading, page, user]);

  useEffect(() => {
    let active = true;

    const loadListings = async () => {
      const savedListings = localStorage.getItem('rewearListings');
      if (savedListings) {
        const legacyListings = JSON.parse(savedListings);
        if (!Array.isArray(legacyListings)) {
          throw new Error('Saved listings could not be imported. Please contact support.');
        }

        await Promise.all(legacyListings.map((listing) => {
          if (!listing || typeof listing.id !== 'string') {
            throw new Error('A saved listing is missing its ID and could not be imported.');
          }
          return postJson('/api/products', {
            ...listing,
            clientId: listing.id,
            sellerId,
          });
        }));
        localStorage.removeItem('rewearListings');
      }

      const ownerQuery = `?sellerId=${encodeURIComponent(sellerId)}`;
      const [allListings, myListings] = await Promise.all([
        getJson('/api/products'),
        getJson(`/api/products/mine${ownerQuery}`),
      ]);
      if (!active) return;
      setMarketplaceListings(allListings);
      setSellerListings(myListings);
      setListingError('');
    };

    loadListings().catch((error) => {
      if (active) {
        setListingError(error instanceof Error ? error.message : 'Unable to load marketplace listings.');
      }
    });

    return () => {
      active = false;
    };
  }, [sellerId]);

  useEffect(() => {
    if (page !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (window.location.hash.startsWith('#/')) return;

    const targetId = window.location.hash.slice(1);
    if (targetId && targetId !== 'home') {
      document.getElementById(targetId)?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  const addToCart = (product, size) => {
    const item = size ? { ...product, size } : product;
    const nextCart = [...cart, item];
    localStorage.setItem('lunaCart', JSON.stringify(nextCart));
    setCart(nextCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    const nextCart = cart.filter((_, index) => index !== indexToRemove);
    localStorage.setItem('lunaCart', JSON.stringify(nextCart));
    setCart(nextCart);
  };

  const openCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      sessionStorage.setItem('lunaReturnToCheckout', 'true');
      window.location.hash = '#/account';
      return;
    }
    window.location.hash = '#/checkout';
  };

  const clearCart = () => {
    localStorage.setItem('lunaCart', JSON.stringify([]));
    setCart([]);
  };

  const updateAuthUser = (nextUser) => {
    setUser(nextUser);
    setAuthLoadError('');
  };

  const addListing = async (listing) => {
    const savedListing = await postJson('/api/products', {
      ...listing,
      clientId: listing.id,
      sellerId,
    });
    setSellerListings((currentListings) => [savedListing, ...currentListings]);
    setMarketplaceListings((currentListings) => [savedListing, ...currentListings]);
    setListingError('');
    return savedListing;
  };

  const deleteListing = async (listingId) => {
    const query = `?sellerId=${encodeURIComponent(sellerId)}`;
    await deleteJson(`/api/products/${encodeURIComponent(listingId)}${query}`);
    setSellerListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== listingId)
    );
    setMarketplaceListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== listingId)
    );
    setListingError('');
  };

  const joinLuna = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setJoinStatus('');
    setIsJoining(true);

    try {
      const result = await postJson('/api/users', {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notifications: formData.get('notifications') === 'on',
      });
      setJoinStatus(result.message);
      form.reset();
    } catch (error) {
      setJoinStatus(error instanceof Error ? error.message : 'Unable to join LUNA right now.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="luna-app">
      <div className="announcement">
        ✦ GOOD CLOTHES DESERVE A SECOND LIFE ✦
      </div>

      <Navbar
        cartCount={cart.length}
        accountLabel={user ? 'MY ACCOUNT' : 'LOGIN'}
        onOpenBag={() => setIsCartOpen(true)}
      />
      {page === 'collections' ? (
        <Collection />
      ) : page === 'contact' ? (
        <Contact />
      ) : page === 'account' ? (
        <Account user={user} onAuthChange={updateAuthUser} sessionError={authLoadError} />
      ) : page === 'checkout' ? (
        isAuthLoading ? (
          <main className="account-page"><p>Loading your account…</p></main>
        ) : (
          <Checkout items={cart} user={user} onOrderPlaced={clearCart} />
        )
      ) : page === 'sell' ? (
        <Sell
          listings={sellerListings}
          listingError={listingError}
          onCreateListing={addListing}
          onDeleteListing={deleteListing}
        />
      ) : page === 'shop' ? (
        <Products
          onAddToBag={addToCart}
          sellerListings={marketplaceListings}
          listingError={listingError}
          heading="Shop All"
          eyebrow="PRE-LOVED, READY FOR YOU"
        />
      ) : (
        <>
          <Hero />
          <section className="role-paths" aria-label="Choose how to shop or sell with LUNA">
            <a className="role-card" href="#/shop">
              <span>FOR BUYERS</span>
              <h2>Find your next favourite.</h2>
              <p>Browse unique pre-loved pieces at a little less than new.</p>
              <strong>START SHOPPING →</strong>
            </a>
            <a className="role-card role-card-seller" href="#/sell">
              <span>FOR SELLERS</span>
              <h2>Pass your pieces on.</h2>
              <p>List clothes you no longer wear and give them another life.</p>
              <strong>SELL WITH LUNA →</strong>
            </a>
          </section>
          <section className="intro-section">
            <h2>Wear it again. Love it longer.</h2>
            <p>
              LUNA brings good-quality pre-loved fashion back into rotation.
              Find a one-of-a-kind piece, or pass something you love on to its next home.
            </p>
          </section>
          <section className="luna-banner">
            <div>
              <small>MAKE ROOM FOR A SECOND STORY</small>
              <h2>Good finds. Better footprints.</h2>
              <a href="#/shop">BROWSE PRE-LOVED</a>
            </div>
          </section>
          <About />
          <section className="account-section" id="login">
            <div className="account-card">
              <small>JOIN THE LUNA COMMUNITY</small>
              <h2>Style has more than one life.</h2>
              <p>Get updates when fresh finds land and discover new ways to keep clothes in circulation.</p>

              <form className="account-form" onSubmit={joinLuna}>
                <label htmlFor="account-name">Full name</label>
                <input id="account-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />

                <label htmlFor="account-email">Email address</label>
                <input id="account-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />

                <label htmlFor="account-phone">Phone number</label>
                <input id="account-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your phone number" required />

                <label className="notification-option">
                  <input name="notifications" type="checkbox" />
                  <span>Yes, send me LUNA updates by email or SMS.</span>
                </label>

                <p className="account-note" role="status" aria-live="polite">{joinStatus}</p>
                <button type="submit" disabled={isJoining}>
                  {isJoining ? 'JOINING...' : 'JOIN LUNA'}
                </button>
              </form>
            </div>
          </section>
          <Newsletter />
        </>
      )}
      <Footer />
      {isCartOpen && (
        <Cart
          items={cart}
          onClose={closeCart}
          onRemove={removeFromCart}
          onCheckout={openCheckout}
        />
      )}
    </div>
  );
}

export default App;
