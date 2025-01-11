import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "src/assets/default.png";
import {Link} from "react-router-dom";
import {T_Service} from "../../modules/types.ts";

interface ServiceCardProps {
    service: T_Service;
    isMock: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isMock }) => {
    const imageSrc = service.image_url && !isMock ? service.image_url : mockImage;

    return (
        <Card key={service.id} style={{ width: '18rem', margin: "0 auto 50px", height: "calc(100% - 50px)" }}>
            <CardImg
                src={imageSrc}
                style={{ height: "300px" }}
                alt="Изображение услуги"
            />
            <CardBody className="d-flex flex-column justify-content-between">
                <CardTitle tag="h5">{service.name}</CardTitle>
                <CardText>Цена: {service.price} руб.</CardText>
                <Link to={`/services/${service.id}`}>
                    <Button color="primary">Подробнее</Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ServiceCard;
