import React, { FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateProfile } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { 
  setProfileUsername,
  setProfilePassword,
  resetProfileForm,
  initializeProfileForm,
  selectProfileForm 
} from '../../slices/authFormsSlice';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  const profileForm = useSelector(selectProfileForm);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.username !== profileForm.username) {
      dispatch(initializeProfileForm({ 
        username: user.username 
      }));
    }
  }, [isAuthenticated, navigate, user, dispatch, profileForm.username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.username.trim()) {
      console.log('Имя пользователя обязательно');
      return;
    }
    
    try {
      const result = await dispatch(updateProfile({
        username: profileForm.username,
        password: profileForm.password
      }));
      
      if (updateProfile.fulfilled.match(result)) {
        dispatch(resetProfileForm());
      }
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      dispatch(setProfileUsername(value));
    } else if (name === 'password') {
      dispatch(setProfilePassword(value));
    }
  };

  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            className="form-control"
            type="text"
            id="username"
            name="username"
            value={profileForm.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Новый пароль</label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={profileForm.password}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;