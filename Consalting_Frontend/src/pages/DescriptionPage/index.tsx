import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { T_Service } from "../../modules/types.ts";
import { Col, Container, Row } from "reactstrap";
import { ServiceMocks } from "../../modules/Mocks.ts";
import mockImage from "src/assets/default.png";

interface ServicePageProps {
    selectedService: T_Service | null;
    setSelectedService: (service: T_Service | null) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
}

const ServicePage: React.FC<ServicePageProps> = ({
    selectedService,
    setSelectedService,
    isMock,
    setIsMock
}) => {
    const { id } = useParams<{ id: string }>();

    const fetchData = async () => {
        const url = `/api/services/${id}`;
        try {
            const response = await fetch(url);
            const serviceData = await response.json();
            setSelectedService(serviceData);
            setIsMock(false);
        } catch {
            getMocks();
        }
    };

    const getMocks = () => {
        const mockService = ServiceMocks.find((service) => service.id === parseInt(id as string));
        if (mockService) {
            setSelectedService(mockService);
        } else {
            setSelectedService({
                id: parseInt(id as string),
                name: "(MOCK) Услуга не найдена",
                description: "Описание недоступно. Проверьте подключение к серверу.",
                status: "N/A",
                price: "0.00",
                duration: 0,
                image_url: mockImage
            });
        }
        setIsMock(true);
    };
    

    useEffect(() => {
        fetchData();
        return () => setSelectedService(null);
    }, [id]);

    if (!selectedService) {
        return <div>Загрузка...</div>;
    }
    const imageSrc = selectedService.image_url && !isMock ? selectedService.image_url : mockImage;
    return (
        <Container>
            <Row>
            <Col md="6">
                    <img
                        alt="Изображение услуги"
                        src={imageSrc}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedService.name}</h1>
                    <p className="fs-5">Описание: {selectedService.description}</p>
                    <p className="fs-5">Цена: {selectedService.price} руб.</p>
                    <p className="fs-5">Продолжительность: {selectedService.duration} часов</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ServicePage;
