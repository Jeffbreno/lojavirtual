import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { FaUser, FaUserCircle, FaPhone, FaEnvelope, FaMapMarkedAlt, FaBirthdayCake, FaIdCard } from 'react-icons/fa';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      setUser(profile);
    };

    fetchProfile();
  }, []);

  if (!user) return <p className="text-center mt-5">Carregando perfil...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 d-flex align-items-center">
        <FaUserCircle className="me-2" />
        Meu Perfil
      </h2>
      <ul className="list-group">
        <li className="list-group-item">
          <FaUser className="me-2" />
          <strong>Usuário:</strong> {user.username}
        </li>
        <li className="list-group-item">
          <FaUserCircle className="me-2" />
          <strong>Nome Completo:</strong> {user.full_name}
        </li>
        <li className="list-group-item">
          <FaPhone className="me-2" />
          <strong>Telefone:</strong> {user.phone || 'Não informado'}
        </li>
        <li className="list-group-item">
          <FaIdCard className="me-2" />
          <strong>CPF/CNPJ:</strong> {user.cpf_cnpj || 'Não informado'}
        </li>
        <li className="list-group-item">
          <FaBirthdayCake className="me-2" />
          <strong>Data de nascimento:</strong> {user.birth_date || 'Não informado'}
        </li>
        <li className="list-group-item">
          <FaMapMarkedAlt className="me-2" />
          <strong>Endereço:</strong> {user.address || 'Não informado'}
        </li>
        <li className="list-group-item">
          <FaEnvelope className="me-2" />
          <strong>Email:</strong> {user.email}
        </li>
      </ul>
    </div>
  );
};

export default ProfilePage;
