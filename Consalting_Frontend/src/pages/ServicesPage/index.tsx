import "./ServicesPage.css";
import { Button, Col, Container, Form, Input, Row } from "reactstrap";
import ServiceCard from "../../components/ServiceCard/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setServiceName, fetchServices } from "../../slices/serviceSlice";

const ServicesListPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { serviceName, filteredServices, isMock, loading } = useSelector((state: RootState) => state.services);
    const [localServiceName, setLocalServiceName] = useState(serviceName);

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setServiceName(localServiceName));
    };

    useEffect(() => {
        dispatch(fetchServices(serviceName));
    }, [serviceName, dispatch]);

    return (
        <Container className="services-page">
            <Row className="services-page__form mb-5">
                <Col md="6">
                    <Form onSubmit={search}>
                        <Row>
                            <Col md="8">
                                <Input
                                    value={localServiceName}
                                    onChange={(e) => setLocalServiceName(e.target.value)}
                                    placeholder="Введите название услуги"
                                />
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn" type="submit">
                                    Поиск
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <div className="services-page__cards">
                {loading ? (
                    <div>Загрузка...</div>
                ) : (
                    filteredServices.map((service) => (
                        <ServiceCard key={service.id} service={service} isMock={isMock} />
                    ))
                )}
            </div>
        </Container>
    );
};

export default ServicesListPage;