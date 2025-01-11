// src/API/parkingsApi.ts
export const fetchParkings = async () => {
    const response = await fetch('/parkings');  // Здесь используем относительный путь
    if (!response.ok) {
      throw new Error('Ошибка загрузки парковок');
    }
  
    const data = await response.json();
    return Array.isArray(data) ? data : data.parkings || [];
  };
  
  export const fetchParkingById = async (id: number) => {
    const response = await fetch(`/services/${id}`);  // Используем относительный путь
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных парковки');
    }
  
    const data = await response.json();
    console.log('Детали парковки из API:', data); // Отладка
    return data;
  };