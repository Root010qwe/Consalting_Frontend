import React, { useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { ModerServiceCard } from '../../components/ModerServiceCard';
import { fetchServices } from '../../slices/serviceSlice';
import { setServiceName } from '../../slices/serviceSlice';
import { deleteService } from '../../slices/moderSlice';

export const ModerServicesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const services = useAppSelector((state) => state.services.filteredServices);
  const serviceName = useAppSelector((state) => state.services.serviceName);
  const isLoading = useAppSelector((state) => state.services.loading);
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

  // Проверка прав доступа
  useEffect(() => {
    if (!isAuthenticated || !isModerator) {
      navigate('/403');
    }
  }, [isAuthenticated, isModerator, navigate]);

  // Если нет прав доступа, не рендерим содержимое
  if (!isAuthenticated || !isModerator) {
    return null;
  }

  // Загрузка списка услуг
  const loadServices = () => {
    dispatch(fetchServices(serviceName));
  };

  useEffect(() => {
    loadServices();
  }, [dispatch, serviceName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadServices();
  };

  const handleEdit = (id: number) => {
    navigate(`/moder/services/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await dispatch(deleteService(id)).unwrap();
        // После успешного удаления обновляем список
        loadServices();
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении услуги');
      }
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление услугами</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/moder/services/add')}
        >
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
    </Container>
  );
};

export default ModerServicesPage;