import "./ServicesPage.css"; // Подключаем стили
import { Button, Col, Container, Form, Input, Row } from "reactstrap";
import { T_Service } from "../../modules/types.ts";
import ServiceCard from "../../components/ServiceCard/index.tsx";
import { useEffect } from "react";
import { ServiceMocks } from "../../modules/Mocks.ts";
import * as React from "react";

interface ServicesListPageProps {
    services: T_Service[];
    setServices: (services: T_Service[]) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
    serviceName: string;
    setServiceName: (name: string) => void;
}

const ServicesListPage: React.FC<ServicesListPageProps> = ({
    services,
    setServices,
    isMock,
    setIsMock,
    serviceName,
    setServiceName,
}) => {
    const fetchData = async () => {
        const url = `/api/services/?name=${serviceName.toLowerCase()}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setServices(data.services);
            setIsMock(false);
        } catch {
            getMocks();
        }
    };

    const getMocks = () => {
        setServices(
            ServiceMocks.filter((service) =>
                service.name.toLowerCase().includes(serviceName.toLowerCase())
            )
        );
        setIsMock(true);
    };

    const search = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isMock) {
            getMocks();
        } else {
            await fetchData();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container className="services-page">
            <Row className="services-page__form mb-5">
                <Col md="6">
                    <Form onSubmit={search}>
                        <Row>
                            <Col md="8">
                                <Input
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="Введите название услуги"
                                />
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">
                                    Поиск
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <div className="services-page__cards">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} isMock={isMock} />
                ))}
            </div>
        </Container>
    );
};

export default ServicesListPage;
