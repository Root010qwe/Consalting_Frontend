import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Service} from "../../modules/types.ts";
import {isHomePage, isServicePage} from "../../modules/Utils.ts";

interface BreadcrumbsProps {
    selectedService: T_Service | null;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ selectedService }) => {
    const location = useLocation();

    return (
        <Breadcrumb className="fs-5" style={{ paddingLeft: "75px" }}>
            {isHomePage(location.pathname) && (
                <BreadcrumbItem>
                    <Link to="/">Главная</Link>
                </BreadcrumbItem>
            )}
            {location.pathname.includes("/services") && (
                <BreadcrumbItem active>
                    <Link to="/services">Услуги</Link>
                </BreadcrumbItem>
            )}
            {isServicePage(location.pathname) && (
                <BreadcrumbItem active>
                    <Link to={location.pathname}>{selectedService?.name}</Link>
                </BreadcrumbItem>
            )}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
