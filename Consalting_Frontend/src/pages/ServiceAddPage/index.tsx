import { useState, useEffect } from "react";
import { T_Service } from "../../modules/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { createService } from "../../slices/moderSlice";
import { useNavigate } from "react-router-dom";
import React from "react";

export const ServiceAddPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);
    // Проверка прав доступа
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const isModerator = Boolean(user?.is_staff || user?.is_superuser);

    const statusOptions = {
        "A": "Активна",
        "D": "Отключена"
    };

    const [service, setService] = useState<T_Service>({
        name: '',
        description: '',
        status: 'A',
        price: '0.00',
        duration: 0,
        image_url: ''
    });

    useEffect(() => {
        if (!isModerator) {
            navigate("/403");
        }
    }, [isModerator, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setService(prevService => ({
            ...prevService,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImageFile(file);
            // Создаем временный URL для предпросмотра
            const imageUrl = URL.createObjectURL(file);
            setService(prevService => ({
                ...prevService,
                image_url: imageUrl
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Отправляем данные на сервер:", service);
            const newService = await dispatch(createService(service)).unwrap();
            console.log("Услуга успешно создана:", newService);
            
            // После успешного создания перенаправляем на страницу модерации услуг
            navigate("/moder-services");
        } catch (error) {
            console.error("Ошибка при создании услуги:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Создать новую услугу</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="mb-3">
                    <label className="form-label">Название услуги</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={service.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Описание</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={service.description || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Статус</label>
                    <select
                        className="form-control"
                        name="status"
                        value={service.status}
                        onChange={handleChange}
                    >
                        {Object.entries(statusOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Цена</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={service.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Длительность (в часах)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={service.duration || 0}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Изображение</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {service.image_url && (
                        <img 
                            src={service.image_url} 
                            alt="Предпросмотр" 
                            className="mt-2"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Создать услугу</button>
                </div>
            </form>
        </div>
    );
};
export default ServiceAddPage;