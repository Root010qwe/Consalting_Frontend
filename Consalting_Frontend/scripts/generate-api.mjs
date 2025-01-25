import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts', // Имя файла для сгенерированного API
    output: resolve(process.cwd(), './src/api'), // Папка, куда будет сохранен файл
    url: 'http://localhost:8000/swagger/?format=openapi', // URL Swagger-документации
    httpClientType: 'axios', // Тип HTTP клиента
});

