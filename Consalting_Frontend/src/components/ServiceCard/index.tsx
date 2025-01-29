import { FC, MouseEvent } from "react";
import "./ServiceCard.css";
import { T_Service } from "../../modules/types.ts";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store.ts";
import { addServiceToDraft } from "../../slices/serviceSlice.ts";
import mockImage from "src/assets/5.png";
import { fetchRequestDetail } from "../../slices/requestDraftSlice.ts";

interface ServiceCardProps {
  service: T_Service;
  isMock: boolean;
  imageClickHandler?: () => void;
  onAddToDraft?: () => void; // Дополнительный коллбэк для уведомления родителя
  requestId?: string;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  isMock,
  imageClickHandler,
  onAddToDraft,
  requestId,
}) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Выбираем изображение
  const imageSrc = service.image_url && !isMock ? service.image_url : mockImage;

  // При клике на "Добавить"
  const handleAddClick = async (e: MouseEvent) => {
    e.stopPropagation();

    if (service.id !== undefined) {
      try {
        await dispatch(addServiceToDraft(String(service.id)));
        if (requestId) await dispatch(fetchRequestDetail("" + requestId));

        // Уведомляем родительский компонент, если требуется
        if (onAddToDraft) {
          onAddToDraft();
        }
      } catch (error) {
        console.error("Ошибка при добавлении услуги:", error);
      }
    }
  };

  return (
    <div className="service-card" onClick={imageClickHandler}>
      <img
        className="service-card__image"
        src={imageSrc}
        alt="Изображение услуги"
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
              className="btn btn-primary"
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
