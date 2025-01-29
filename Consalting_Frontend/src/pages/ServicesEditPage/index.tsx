import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../store';
import { T_Service } from '../../modules/types';
import { fetchServiceById } from '../../slices/serviceSlice';


export const ServicesEditPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Проверка прав доступа
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

  const [service, setService] = useState<T_Service>({
    name: '',
    price: '0',
    description: '',
    duration: 0,
    status: 'A',
    image_url: null
  });

  const statusOptions = {
    'A': 'Активна',
    'D': 'Удалена'
  };

  useEffect(() => {
    if (!isAuthenticated || !isModerator) {
      navigate('/403');
    }
  }, [isAuthenticated, isModerator, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id))
        .unwrap()
        .then((response) => {
          // Извлекаем данные услуги из ответа
          const serviceData = response.data;
          setService(serviceData);
        })
        .catch((error) => {
          console.error('Ошибка при загрузке услуги:', error);
          alert('Ошибка при загрузке услуги');
        });
    }
  }, [id, dispatch]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  };

  const handleSubmit = async (event: React.FormEvent) => {

  };

  if (!isAuthenticated || !isModerator) {
    return null;
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Редактирование услуги</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Название услуги</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={service.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={service.description || ''}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Цена (руб.)</Form.Label>
          <Form.Control
            type="text"
            name="price"
            value={service.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Длительность (мин.)</Form.Label>
          <Form.Control
            type="number"
            name="duration"
            value={service.duration || 0}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Статус</Form.Label>
          <Form.Select
            name="status"
            value={service.status}
            onChange={handleChange}
          >
            {Object.entries(statusOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Изображение</Form.Label>
          {service.image_url && (
            <div className="mb-2">
              <img
                src={service.image_url}
                alt={service.name}
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/moder-services')}
          >
            Отмена
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ServicesEditPage;
