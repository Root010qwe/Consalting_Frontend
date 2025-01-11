import { T_Service } from "../modules/types.ts";

export const ServiceMocks: T_Service[] = [
    {
        id: 51,
        name: "(MOCK) Оптимизация облачных решений",
        description: "Настройка и оптимизация облачных сервисов (AWS, Azure, Google Cloud) для повышения их эффективности и снижения затрат.",
        status: "A",
        price: "75000.00",
        duration: 8,
        image_url: "/assets/5.png", // Укажите корректный путь
    },
    {
        id: 52,
        name: "(MOCK) Пентест веб-приложений",
        description: "Эмуляция хакерских атак для проверки уровня защиты веб-приложений и сервисов.",
        status: "A",
        price: "120000.00",
        duration: 12,
        image_url: "/assets/5.png", // Укажите корректный путь
    }
];
