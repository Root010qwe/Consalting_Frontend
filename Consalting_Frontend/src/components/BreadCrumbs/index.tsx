import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumbs.css";

interface BreadcrumbsProps {
  selectedService?: {
    id?: number;
    name?: string;
  } | null;
}

interface BreadcrumbItem {
  key: string;
  content: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ selectedService }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbs = (): React.ReactNode => {
    // Если мы на главной странице
    if (pathnames.length === 0) {
      return (
        <div className="breadcrumb-item" key="home">
          <Link to="/">Главная</Link>
        </div>
      );
    }

    const breadcrumbs: BreadcrumbItem[] = [];

    // Прямые пути от главной
    if (["profile", "register", "login"].includes(pathnames[0])) {
      breadcrumbs.push({
        key: "home",
        content: (
          <div className="breadcrumb-item" key="home">
            <Link to="/">Главная</Link>
          </div>
        ),
      });
      breadcrumbs.push({
        key: pathnames[0],
        content: (
          <div className="breadcrumb-item active" key={pathnames[0]}>
            {pathnames[0] === "profile" && "Профиль"}
            {pathnames[0] === "register" && "Регистрация"}
            {pathnames[0] === "login" && "Вход"}
          </div>
        ),
      });
      return breadcrumbs.map(item => item.content);
    }

    // Пути, связанные с услугами
    if (pathnames[0] === "services") {
      if (pathnames.length === 1) {
        return (
          <div className="breadcrumb-item active" key="services">
            <Link to="/services">Услуги</Link>
          </div>
        );
      }
      if (selectedService?.name) {
        return (
          <>
            <div className="breadcrumb-item" key="services">
              <Link to="/services">Услуги</Link>
            </div>
            <div className="breadcrumb-item active" key={`service-${selectedService.id}`}>
              {selectedService.name}
            </div>
          </>
        );
      }
    }

    // Пути, связанные с заявками
    if (pathnames[0] === "requests" || pathnames[0] === "request") {
      if (pathnames.length === 1) {
        return (
          <div className="breadcrumb-item active" key="requests">
            <Link to="/requests">Заявки</Link>
          </div>
        );
      }
      if (pathnames[0] === "request" && pathnames[1]) {
        return (
          <>
            <div className="breadcrumb-item" key="requests">
              <Link to="/requests">Заявки</Link>
            </div>
            <div className="breadcrumb-item active" key={`request-${pathnames[1]}`}>
              Заявка №{pathnames[1]}
            </div>
          </>
        );
      }
    }

    return breadcrumbs.map(item => item.content);
  };

  return (
    <nav className="custom-breadcrumb">
      <div className="breadcrumb">
        {getBreadcrumbs()}
      </div>
    </nav>
  );
};

export default Breadcrumbs;