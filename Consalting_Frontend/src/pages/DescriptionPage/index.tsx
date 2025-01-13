import "./DescriptionPage.css";
import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { T_Service } from "../../modules/types.ts";
import { ServiceMocks } from "../../modules/Mocks.ts";
import mockImage from "src/assets/5.png";

interface ServicePageProps {
    selectedService: T_Service | null;
    setSelectedService: (service: T_Service | null) => void;
    isMock: boolean;
    setIsMock: (mock: boolean) => void;
}

const ServicePage: React.FC<ServicePageProps> = ({
    selectedService,
    setSelectedService,
    isMock,
    setIsMock,
}) => {
    const { id } = useParams<{ id: string }>();

    const fetchData = async () => {
        const url = `/api/services/${id}`;
        try {
            const response = await fetch(url);
            const serviceData = await response.json();
            setSelectedService(serviceData);
            setIsMock(false);
        } catch {
            getMocks();
        }
    };

    const getMocks = () => {
        const mockService = ServiceMocks.find(
            (service) => service.id === parseInt(id as string)
        );
        if (mockService) {
            setSelectedService(mockService);
        } else {
            setSelectedService({
                id: parseInt(id as string),
                name: "(MOCK) Услуга не найдена",
                description:
                    "Описание недоступно. Проверьте подключение к серверу.",
                status: "N/A",
                price: "0.00",
                duration: 0,
                image_url: mockImage,
            });
        }
        setIsMock(true);
    };

    useEffect(() => {
        fetchData();
        return () => setSelectedService(null);
    }, [id]);

    if (!selectedService) {
        return <div>Загрузка...</div>;
    }

    const imageSrc =
        selectedService.image_url && !isMock
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
