import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { ModerServiceCard } from '../../components/ModerServiceCard';
import { fetchServices, setServiceName, setCurrentPage } from '../../slices/serviceSlice';
import { deleteService } from '../../slices/moderSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

export const ModerServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const services = useAppSelector((state) => state.services.filteredServices);
  const serviceName = useAppSelector((state) => state.services.serviceName);
  const currentPage = useAppSelector((state) => state.services.currentPage);
  const pageSize = useAppSelector((state) => state.services.pageSize);
  const totalCount = useAppSelector((state) => state.services.totalCount);
  const isLoading = useAppSelector((state) => state.services.loading);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

  // Состояния для диалога подтверждения удаления
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Проверка прав доступа
  useEffect(() => {
    if (!isAuthenticated || !isModerator) {
      navigate('/403');
    }
  }, [isAuthenticated, isModerator, navigate]);

  if (!isAuthenticated || !isModerator) {
    return null;
  }

  // Функция загрузки услуг с пагинацией
  const loadServices = () => {
    dispatch(fetchServices({ serviceName, page: currentPage, page_size: pageSize }));
  };

  useEffect(() => {
    loadServices();
  }, [dispatch, serviceName, currentPage, pageSize]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Сбрасываем пагинацию при новом поиске (начинаем с первой страницы)
    dispatch(setCurrentPage(1));
    loadServices();
  };

  const handleEdit = (id: number) => {
    navigate(`/moder/services/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeleteServiceId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteServiceId !== null) {
      try {
        await dispatch(deleteService(deleteServiceId)).unwrap();
        // Обновление списка после успешного удаления
        loadServices();
      } catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    }
    setShowConfirm(false);
    setDeleteServiceId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteServiceId(null);
  };

  // Пагинация
  const totalPages = Math.ceil(totalCount / pageSize);
  const getPaginationRange = (): (number | string)[] => {
    const delta = 1; // число соседних страниц вокруг текущей
    const range: (number | string)[] = [];
    let lastPage: number | null = null;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (lastPage && i - lastPage > 1) {
          range.push('...');
        }
        range.push(i);
        lastPage = i;
      }
    }
    return range;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      dispatch(setCurrentPage(page));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление услугами</h1>
        <Button variant="primary" onClick={() => navigate('/moder/services/add')}>
          Добавить услугу
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Поиск услуг..."
            value={serviceName}
            onChange={(e) => dispatch(setServiceName(e.target.value))}
          />
          <Button type="submit" variant="primary">Поиск</Button>
        </div>
      </Form>

      {isLoading ? (
        <div className="text-center">Загрузка...</div>
      ) : services.length > 0 ? (
        services.map((service) => (
          <ModerServiceCard
            key={service.id}
            service={service}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <div className="text-center">Услуги не найдены</div>
      )}

      <ConfirmDialog
        show={showConfirm}
        message="Вы уверены, что хотите удалить эту услугу?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
          {getPaginationRange().map((pageItem, index) =>
            typeof pageItem === 'number' ? (
              <Pagination.Item
                key={index}
                active={pageItem === currentPage}
                onClick={() => handlePageChange(pageItem)}
              >
                {pageItem}
              </Pagination.Item>
            ) : (
              <Pagination.Ellipsis key={index} disabled />
            )
          )}
          <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
};

export default ModerServicesPage;