import "./ServicesPage.css";
import {
  Button,
  Col,
  Container,
  Form,
  Input,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import ServiceCard from "../../components/ServiceCard/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setServiceName, fetchServices, setCurrentPage } from "../../slices/serviceSlice";
import { clearDraft } from "../../slices/requestDraftSlice";
import basketIcon from "../../assets/shopping-basket.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ServicesListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    serviceName,
    filteredServices,
    isMock,
    loading,
    next,
    previous,
    currentPage,
    pageSize,
    totalCount,
  } = useSelector((state: RootState) => state.services);
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
    if (app_id) {
      navigate(`/request/${app_id}`);
    }
  };

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setServiceName(localServiceName));
    // Сбрасываем пагинацию при новом поиске (начинаем с первой страницы)
    dispatch(setCurrentPage(1));
  };

  // Загружаем услуги при изменении параметров
  useEffect(() => {
    dispatch(fetchServices({ serviceName, page: currentPage, page_size: pageSize }));
  }, [serviceName, currentPage, pageSize, dispatch]);

  // Обработчики для перехода между страницами
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(totalCount / pageSize);

  // Функция для генерации сокращённого диапазона номеров страниц с многоточиями
  const getPaginationRange = (): (number | string)[] => {
    const delta = 1; // количество соседних страниц вокруг текущей
    const range: (number | string)[] = [];
    const left = currentPage - delta;
    const right = currentPage + delta;
    let lastPage: number | null = null;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (lastPage && i - lastPage > 1) {
          range.push("...");
        }
        range.push(i);
        lastPage = i;
      }
    }
    return range;
  };

  return (
    <Container className="services-page">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Услуги
      </motion.h1>

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

      {/* Панель пагинации */}
      <Row className="mt-4 pagination-controls">
        <Col>
          <Pagination>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink previous onClick={handlePreviousPage} />
            </PaginationItem>
            {getPaginationRange().map((pageItem, index) =>
              typeof pageItem === "number" ? (
                <PaginationItem key={index} active={pageItem === currentPage}>
                  <PaginationLink onClick={() => dispatch(setCurrentPage(pageItem))}>
                    {pageItem}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={index} disabled>
                  <PaginationLink>{pageItem}</PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem disabled={currentPage === totalPages || totalPages === 0}>
              <PaginationLink next onClick={handleNextPage} />
            </PaginationItem>
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default ServicesListPage;
