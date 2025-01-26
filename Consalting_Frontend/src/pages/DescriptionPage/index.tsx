import "./DescriptionPage.css";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceById, clearSelectedService } from "../../slices/serviceSlice";
import mockImage from "src/assets/5.png";

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
        return <div>Загрузка...</div>;
    }

    if (!selectedService) {
        return <div>Услуга не найдена</div>;
    }

    const imageSrc = selectedService.image_url && !isMock 
        ? selectedService.image_url 
        : mockImage;

    return (
        <div className="service-page__container">
            <img
                alt="Изображение услуги"
                src={imageSrc}
                className="service-page__image"
            />
            <div className="service-page__info">
                <h1>{selectedService.name}</h1>
                <p>Описание: {selectedService.description}</p>
                <p>Цена: {selectedService.price} руб.</p>
                <p>Продолжительность: {selectedService.duration} часов</p>
            </div>
        </div>
    );
};

export default ServicePage;
