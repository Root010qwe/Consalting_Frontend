import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { loginUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { 
  setLoginUsername, 
  setLoginPassword, 
  resetLoginForm,
  selectLoginForm 
} from '../../slices/authFormsSlice';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { username, password } = useSelector(selectLoginForm);
  const error = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      dispatch(setLoginUsername(value));
    } else if (name === 'password') {
      dispatch(setLoginPassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ username, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(resetLoginForm());
      navigate('/');
    }
  };

  return (
    <div className="LoginPage wrapper"> {/* Добавлен класс wrapper */}
      <form onSubmit={handleSubmit}>
        <h1>Вход</h1>
        {error && <h2 className="error">{error}</h2>} {/* Изменено на h2 */}
        <div className="form-group">
          <label>Логин</label>
          <input 
            type="text" 
            name="username" 
            value={username} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;