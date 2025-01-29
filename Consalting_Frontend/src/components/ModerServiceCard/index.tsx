import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { T_Service } from '../../modules/types';
import './ModerServiceCard.css';
import defaultImage from '../../assets/default.png';

interface ModerServiceCardProps {
  service: T_Service;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ModerServiceCard: React.FC<ModerServiceCardProps> = ({
  service,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="service-card-container mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img 
            src={service.image_url || defaultImage} 
            alt={service.name} 
            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
          />
          <div>
            <Card.Title>{service.name}</Card.Title>
            <Card.Text>
              Цена: {service.price} руб.<br/>
              Длительность: {service.duration || 0} мин.<br/>
              Статус: {service.status === 'A' ? 'Активна' : 'Неактивна'}
            </Card.Text>
          </div>
        </div>
        <div className="d-flex flex-column gap-2">
          <Button 
            variant="outline-primary" 
            className="outlined-btn"
            onClick={() => service.id && onEdit(service.id)}
          >
            Редактировать
          </Button>
          <Button 
            variant="danger" 
            onClick={() => service.id && onDelete(service.id)}
          >
            Удалить
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
