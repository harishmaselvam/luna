
import { useState } from 'react';
import { postJson } from '../api';
import './newsletter.css';

function Newsletter() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus('');
    setIsSubmitting(true);

    try {
      const result = await postJson('/api/subscribers', {
        email: formData.get('email'),
      });
      setStatus(result.message);
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to subscribe right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="newsletter-content">
        <h2>A Little Love from LUNA</h2>

        <p>
          Subscribe to discover new pre-loved finds and community updates.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </form>
        <p role="status" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}

export default Newsletter;
