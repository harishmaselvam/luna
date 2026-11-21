
import './footer.css';

function Footer() {
  return (
    <footer className="luna-footer">
      <h2>LUNA</h2>
      <p>GOOD CLOTHES DESERVE A SECOND LIFE.</p>

      <div className="footer-links">
        <a href="#home">HOME</a>
        <a href="#/shop">SHOP</a>
        <a href="#/sell">SELL</a>
        <a href="#about">ABOUT</a>
        <a href="#/contact">CONTACT</a>
      </div>

      <p>Instagram | Pinterest | Facebook</p>
      <p className="footer-copyright">© 2026 LUNA. ALL RIGHTS RESERVED.</p>
    </footer>
  );
}

export default Footer;
