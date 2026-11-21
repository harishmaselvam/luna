
import './navbar.css';

function Navbar({ cartCount, accountLabel, onOpenBag }) {
  return (
    <header className="navbar">
      <a href="#home" className="navbar-logo">LUNA</a>

      <nav className="nav-links">
        <a href="#home">HOME</a>
        <a href="#about">ABOUT</a>
        <a href="#/shop">SHOP PRE-LOVED</a>
        <a href="#/sell">SELL WITH US</a>
        <a href="#/contact">CONTACT</a>
        <a href="#/account">{accountLabel}</a>
      </nav>

      <button className="nav-bag" type="button" onClick={onOpenBag}>
        BAG <span>({cartCount})</span>
      </button>
    </header>
  );
}

export default Navbar;
