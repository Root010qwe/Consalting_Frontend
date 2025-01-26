// Тип для услуги
export type T_Service = {
    id: number,
    name: string,
    description: string,
    status: string,
    price: string,
    duration: number,
    image_url: string
};

// Тип для запроса
export type T_Request = {
    id: number;
    client: number;
    status: string;
    creation_date: string;
    completion_date: string | null;
    manager_username: string;
    total_cost: string;
};

// Тип для запроса на услугу
export type T_ServiceRequest = {
    id: number;
    service: T_Service;
    comment: string;
};

// Тип для деталей запроса
export type T_RequestDetail = {
    id: number;
    client: string;
    manager: string | null;
    status: string;
    creation_date: string;
    completion_date: string | null;
    service_requests: T_ServiceRequest[];
    total_cost: string;
};

// Тип для пользователя
export type T_User = {
    id: number;
    username: string;
    password: string; // Добавляем обязательное поле
    is_staff?: boolean;
    is_superuser?: boolean;
};

// Тип для входа в систему
export type T_Login = {
    username: string;
    password: string;
};
export type T_RegistrationData = {
    username: string;
    password: string;
    email: string;
    // Добавьте другие необходимые поля
  };

export type T_UpdateProfileData = {
    username?: string;
    password?: string;
  };