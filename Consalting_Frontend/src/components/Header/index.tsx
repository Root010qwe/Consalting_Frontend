import { useState } from "react";
import { Navbar, NavbarToggler, Collapse, Nav, NavItem } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../slices/userSlice';
import "./Header.css";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const username = user?.username;
    
    const isModerator = Boolean(user?.is_staff || user?.is_superuser);

    console.log('User data:', user);
    console.log('Is moderator:', isModerator);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar dark expand="md" className="header-navbar">
            <Link to="/" className="navbar-brand">
                Консалтинг
            </Link>
            
            <NavbarToggler onClick={toggle} className="mr-2" />
            
            <Collapse isOpen={isOpen} navbar className="justify-content-end">
                <Nav navbar className="header-nav">
                    <NavItem>
                        <NavLink to="/" end className="nav-link">
                            Главная
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/services" className="nav-link">
                            Услуги
                        </NavLink>
                    </NavItem>

                    {isAuthenticated && isModerator && (
                        <>
                            <NavItem>
                                <NavLink to="/moder-services" className="nav-link">
                                    Редактор Услуг
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/moder-requests" className="nav-link">
                                    Редактор Заявок
                                </NavLink>
                            </NavItem>
                        </>
                    )}

                    {isAuthenticated ? (
                        <>
                            <NavItem>
                                <NavLink to="/requests" className="nav-link">
                                    Мои заявки
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/profile" className="nav-link">
                                    {username}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink 
                                    to="/" 
                                    className="nav-link logout" 
                                    onClick={() => dispatch(logoutUser())}
                                >
                                    Выйти
                                </NavLink>
                            </NavItem>
                        </>
                    ) : (
                        <>
                            <NavItem>
                                <NavLink to="/login" className="nav-link">
                                    Войти
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to="/register" className="nav-link">
                                    Регистрация
                                </NavLink>
                            </NavItem>
                        </>
                    )}
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default Header;