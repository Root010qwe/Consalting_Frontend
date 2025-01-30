// Тип для услуги (синхронизирован с Api.ts -> Service)
export type T_Service = {
  /** ID */
  id?: number;
  /** Name */
  name: string;
  /** Description */
  description?: string | null;
  /** Status (A=Active, D=Disabled) */
  status?: "A" | "D";
  /** Price (decimal) */
  price: string;
  /** Duration (в часах) */
  duration?: number | null;
  /** Image url */
  image_url?: string | null;
};

// Тип для запроса (Request из Api.ts)
export type T_Request = {
  id?: number;
  client: number;
  status?: "Draft" | "Submitted" | "Completed" | "Rejected" | "Deleted";
  creation_date?: string;
  completion_date?: string | null;
  manager_username?: string | null;
  total_cost?: string | null;
  priority_level?: "Low" | "Medium" | "High";
  formed_date?: string | null;
  contact_phone?: string | null;
  services: T_Service[];
  qr?: string | null;
};

// Тип для связи услуги и запроса (ServiceRequest из Api.ts)
export type T_ServiceRequest = {
  id?: number;
  service?: T_Service;
  comment?: string | null;
};

// Тип для детального запроса (RequestDetail из Api.ts)
export type T_RequestDetail = {
  id?: number;
  client: string; // Изменено с number на string
  manager?: string | null;
  status?: "Draft" | "Submitted" | "Completed" | "Rejected" | "Deleted";
  creation_date?: string;
  completion_date?: string | null;
  service_requests?: T_ServiceRequest[];
  total_cost?: string | null;
  services: T_Service[];
  contact_phone?: string; // Добавлено поле контактного телефона
  priority_level?: "Low" | "Medium" | "High"; // Добавлено поле уровня приоритета
};

// Тип для пользователя
export type T_User = {
  id?: number;
  username: string;
  password: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

// Тип для входа в систему
export type T_Login = {
  username: string;
  password: string;
};

// Тип для регистрации
export type T_RegistrationData = {
  username: string;
  password: string;
  // Добавьте другие необходимые поля, если нужно
};

// Тип для обновления профиля
export type T_UpdateProfileData = {
  username?: string;
  password?: string;
};
