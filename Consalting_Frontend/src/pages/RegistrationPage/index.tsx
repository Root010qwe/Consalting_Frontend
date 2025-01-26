import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';
import { 
  setRegistrationUsername,
  setRegistrationPassword,
  resetRegistrationForm,
  selectRegistrationForm 
} from '../../slices/authFormsSlice';

const RegistrationPage = () => {
  const formData = useSelector(selectRegistrationForm);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch(name) {
      case 'username':
        dispatch(setRegistrationUsername(value));
        break;
      case 'password':
        dispatch(setRegistrationPassword(value));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(resetRegistrationForm());
      navigate('/login');
    }
  };

  return (
    <div className="registration-page">
      <form onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Имя пользователя:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit"  className="btn btn-primary" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

// Явно указываем экспорт по умолчанию
export default RegistrationPage;