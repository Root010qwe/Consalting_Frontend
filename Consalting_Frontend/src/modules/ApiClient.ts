
  
  export const fetchParkingById = async (id: number) => {
    const response = await fetch(`/services/${id}`);  // Используем относительный путь
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных ');
    }
  
    const data = await response.json();
    console.log('Детали  из API:', data); // Отладка
    return data;
  };