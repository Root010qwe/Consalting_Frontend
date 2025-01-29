import "./ServicesPage.css";
import { Button, Col, Container, Form, Input, Row } from "reactstrap";
import ServiceCard from "../../components/ServiceCard/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setServiceName, fetchServices } from "../../slices/serviceSlice";
import { clearDraft } from "../../slices/requestDraftSlice";
import basketIcon from "../../assets/shopping-basket.png";
import { Link, useNavigate } from "react-router-dom";

const ServicesListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { serviceName, filteredServices, isMock, loading } = useSelector(
    (state: RootState) => state.services
  );
  const [localServiceName, setLocalServiceName] = useState(serviceName);

  const { app_id, count } = useSelector(
    (state: RootState) => state.requestDraftSlice
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  // Очистка корзины
  const handleClearBasket = () => {
    dispatch(clearDraft());
  };

  // Обработчик перехода на страницу заявки
  const handleBasketClick = () => {
    console.log(app_id);
    if (app_id) {
      navigate(`/request/${app_id}`);
    }
  };

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
                <Button
                  color="primary"
                  className="w-100 search-btn"
                  type="submit"
                >
                  Поиск
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      
      <Button
        className="basket-btn-fixed"
        disabled={!isAuthenticated}
        onClick={handleBasketClick}
      >
        <img src={basketIcon} alt="Корзина" width="32" />
        {isAuthenticated && app_id && count !== undefined && (
          <span className="basket-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {count}
          </span>
        )}
      </Button>
      
      <div className="services-page__cards">
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isMock={isMock}
              requestId={"" + app_id}
            />
          ))
        )}
      </div>
    </Container>
  );
};

export default ServicesListPage;
