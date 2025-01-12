import { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/" className="header__link">
                    Консалтинг
                </Link>
            </div>
            <nav className={`header__menu ${isMenuOpen ? "active" : ""}`}>
                <Link to="/" className="header__link" onClick={closeMenu}>
                    Главная
                </Link>
                <Link to="/services" className="header__link" onClick={closeMenu}>
                    Услуги
                </Link>
            </nav>
            <div className="header__burger" onClick={toggleMenu}>
                <div />
                <div />
                <div />
            </div>
        </header>
    );
};

export default Header;
