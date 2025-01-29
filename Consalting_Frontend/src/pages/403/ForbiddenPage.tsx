import React from "react";
import { useNavigate } from "react-router-dom";
import "./ForbiddenPage.css";

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="forbidden-container">
            <h1 className="forbidden-title">403</h1>
            <p className="forbidden-message">Доступ запрещён</p>
            <button 
                className="forbidden-button"
                onClick={() => navigate('/login')} // Заменили ROUTES.HOME на прямой путь
            >
                Авторизоваться
            </button>
        </div>
    );
};

export default ForbiddenPage;