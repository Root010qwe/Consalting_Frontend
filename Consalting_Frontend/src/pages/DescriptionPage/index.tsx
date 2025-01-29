import "./DescriptionPage.css";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceById, clearSelectedService } from "../../slices/serviceSlice";
import mockImage from "src/assets/5.png";
import { Container, Row, Col, Card } from "reactstrap";
import Breadcrumbs from "../../components/BreadCrumbs";

const ServicePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedService, isMock, loading } = useSelector((state: RootState) => state.services);

    useEffect(() => {
        if (id) {
            dispatch(fetchServiceById(id));
        }
        return () => {
            dispatch(clearSelectedService());
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        <div className="text-center">Загрузка...</div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!selectedService) {
        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        <div className="text-center">Услуга не найдена</div>
                    </Col>
                </Row>
            </Container>
        );
    }

    const imageSrc = selectedService.image_url && !isMock 
        ? selectedService.image_url.startsWith('http') 
            ? selectedService.image_url 
            : `${process.env.REACT_APP_API_URL}${selectedService.image_url}`
        : mockImage;

    return (
        <Container className="pt-4">
            <Row className="mb-3">
                <Col>
                    <Breadcrumbs selectedService={selectedService} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="service-details-card">
                        <div className="service-page__container">
                            <div className="service-page__image-container">
                                <img
                                    alt="Изображение услуги"
                                    src={imageSrc}
                                    className="service-page__image"
                                />
                            </div>
                            <div className="service-page__info">
                                <h2 className="service-page__title">{selectedService.name}</h2>
                                <div className="service-page__details">
                                    <div className="service-page__description">
                                        <h4>Описание</h4>
                                        <p>{selectedService.description}</p>
                                    </div>
                                    <div className="service-page__meta">
                                        <div className="service-page__price">
                                            <h4>Стоимость</h4>
                                            <p>{selectedService.price} ₽</p>
                                        </div>
                                        <div className="service-page__duration">
                                            <h4>Продолжительность</h4>
                                            <p>{selectedService.duration} ч.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ServicePage;
