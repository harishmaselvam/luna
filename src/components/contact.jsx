import './contact.css';

function Contact() {
  return (
    <main className="contact-page" id="contact">
      <header className="contact-intro">
        <span>WE’D LOVE TO HEAR FROM YOU</span>
        <h1>Contact LUNA</h1>
        <p>For questions about LUNA, reach us through one of the details below.</p>
      </header>

      <section className="contact-details" aria-label="LUNA contact details">
        <a className="contact-card" href="mailto:LunaFushion@gmail.com">
          <span className="contact-card-label">EMAIL</span>
          <h2>LunaFushion@gmail.com</h2>
          <span className="contact-card-action">SEND AN EMAIL</span>
        </a>

        <a className="contact-card" href="tel:+916437676298">
          <span className="contact-card-label">PHONE</span>
          <h2>+91 64376 76298</h2>
          <span className="contact-card-action">CALL US</span>
        </a>

        <div className="contact-card">
          <span className="contact-card-label">SOCIAL</span>
          <h2>@LunaFushion</h2>
          <span className="contact-card-action">FOLLOW US</span>
        </div>
      </section>
    </main>
  );
}

export default Contact;
