import React, { FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setProfileData, updateProfile } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/BreadCrumbs';
import { Button, Form, Spinner } from 'react-bootstrap';
import './ProfilePage.css';
import {useState} from "react";

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.user);
  
  const [localData, setLocalData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(localData));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setLocalData((prev: any) => ({ ...prev, password: '' }));
      alert('Данные успешно обновлены!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalData({
      ...localData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAuthenticated) {
    return (
      <h2 className="auth-warning">
        Страница недоступна. Пожалуйста, войдите в аккаунт
      </h2>
    );
  }

  return (
    <div className="profile-page">
        <h1>Профиль</h1>
      <Form onSubmit={handleSubmit} className="profile-form">
        <Form.Group className="mb-3">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={localData.username}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={localData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={localData.password}
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