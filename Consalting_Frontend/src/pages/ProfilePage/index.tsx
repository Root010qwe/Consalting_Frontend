import React, { FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateProfile } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
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
      alert('Имя пользователя обязательно');
      return;
    }
    
    try {
      const result = await dispatch(updateProfile({
        username: profileForm.username,
        password: profileForm.password
      }));
      
      if (updateProfile.fulfilled.match(result)) {
        dispatch(resetProfileForm());
        alert('Данные успешно обновлены!');
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
      <Form onSubmit={handleSubmit} className="profile-form">
        <Form.Group className="mb-3">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={profileForm.username}
            onChange={handleChange}
          />
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={localData.email}
            onChange={handleChange}
          />
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={profileForm.password}
            onChange={handleChange}
            placeholder=""
          />
        </Form.Group>

        {error && <div className="error-message">{error}</div>}

        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default ProfilePage;