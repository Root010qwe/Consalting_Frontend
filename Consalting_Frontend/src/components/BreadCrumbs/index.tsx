import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { T_Service } from "../../modules/types";
import { isHomePage, isServicePage } from "../../modules/Utils";
import "./Breadcrumbs.css";

interface BreadcrumbsProps {
    selectedService: T_Service | null;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ selectedService }) => {
    const location = useLocation();

    return (
        <Breadcrumb className="custom-breadcrumb">
            {isHomePage(location.pathname) && (
                <BreadcrumbItem>
                    <Link to="/">Главная</Link>
                </BreadcrumbItem>
            )}
            {location.pathname.includes("/services") && (
                <BreadcrumbItem active={!isServicePage(location.pathname)}>
                    {isServicePage(location.pathname) ? (
                        <Link to="/services">Услуги</Link>
                    ) : (
                        "Услуги"
                    )}
                </BreadcrumbItem>
            )}
            {isServicePage(location.pathname) && selectedService && (
                <BreadcrumbItem active>
                    {selectedService.name}
                </BreadcrumbItem>
            )}
        </Breadcrumb>
    );
};

export default Breadcrumbs;