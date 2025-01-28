import { FC, MouseEvent } from "react";
import "./ServiceCard.css"; 
import { T_Service } from "../../modules/types.ts";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import { addServiceToDraft } from "../../slices/serviceSlice.ts";
import mockImage from "src/assets/5.png";

interface ServiceCardProps {
  service: T_Service;
  isMock: boolean;
  imageClickHandler?: () => void;
  // Вызывается после успешного добавления в черновик, если нужно
  onAddToDraft?: () => void;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  isMock,
  imageClickHandler,
  onAddToDraft,
}) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Выбираем изображение
  const imageSrc = service.image_url && !isMock ? service.image_url : mockImage;

  // При клике на "Добавить" вызываем addServiceToDraft
  const handleAddClick = async (e: MouseEvent) => {
    // Останавливаем всплытие, чтобы не срабатывал onClick на родительском <div>
    e.stopPropagation();

    // Преобразуем service.id в строку, если нужно
    if (service.id !== undefined) {
      await dispatch(addServiceToDraft(String(service.id)));
      

      // Если нужно вызвать дополнительную логику
      if (onAddToDraft) {
        onAddToDraft();
      }
    }
  };

  return (
    <div className="service-card" onClick={imageClickHandler}>
      <img
        className="service-card__image"
        src={imageSrc}
        alt="Изображение услуги"
        onClick={imageClickHandler}
      />
      <div className="service-card__body">
        <h5 className="service-card__title">{service.name}</h5>
        <p className="service-card__text">Цена: {service.price} руб.</p>

        <div className="service-card__actions">
          <Link to={`/services/${service.id}`} className="btn btn-primary">
            Подробнее
          </Link>

          {isAuthenticated && (
            <button
              className="btn btn-outline-dark btn-sm"
              type="button"
              onClick={handleAddClick}
            >
              Добавить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
