import "./ServiceCard.css"; // Подключаем стили
import { Button, Card, CardBody, CardImg, CardText, CardTitle } from "reactstrap";
import mockImage from "src/assets/default.png";
import { Link } from "react-router-dom";
import { T_Service } from "../../modules/types.ts";

interface ServiceCardProps {
    service: T_Service;
    isMock: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isMock }) => {
    const imageSrc = service.image_url && !isMock ? service.image_url : mockImage;

    return (
        <Card className="service-card">
            <CardImg src={imageSrc} alt="Изображение услуги" />
            <CardBody className="service-card__body">
                <CardTitle className="service-card__title">{service.name}</CardTitle>
                <CardText className="service-card__text">Цена: {service.price} руб.</CardText>
                <Link to={`/services/${service.id}`} className="service-card__button">
                    <Button color="primary">Подробнее</Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ServiceCard;
