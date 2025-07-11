'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/componentes/auth/AuthProvider';
import AuthImage from './AuthImage';
import styles from './loginForm.module.css';

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const router = useRouter();
  const pathname = usePathname();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (pathname === '/register') {
      setIsRegister(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/hub');
    }
  }, [isAuthenticated, router]);

  const handleToggleMode = (register: boolean) => {
    setIsRegister(register);
    const path = register ? '/register' : '/login';
    router.push(path);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (isRegister) {
      if (!formData.nome) {
        alert('Por favor, preencha o nome');
        return;
      }
      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem');
        return;
      }
    }

    // Mock login/register logic
    const userData = {
      id: '1',
      nome: formData.nome || 'Usuário Teste',
      email: formData.email
    };
    const token = 'mock-token-' + Date.now();
    
    login(token, userData);
    router.push('/hub');
  };

  const formOrder = isRegister ? styles.order1 : styles.order2;
  const imageOrder = isRegister ? styles.order2 : styles.order1;

  return (
    <div className={styles.mainContainer}>
      <div className={`${styles.formContainer} ${formOrder}`}>
        <h1 className={styles.title}>
          {/* <Image src="/img/d20.png" alt="d20" width={40} height={40} className={styles.titleIcon} /> */}
          Fichas RPG
        </h1>

        <div className={styles.toggleContainer}>
          <button
            type="button"
            className={`${styles.toggleButton} ${!isRegister ? styles.toggleButtonActive : styles.toggleButtonInactive}`}
            onClick={() => handleToggleMode(false)}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${isRegister ? styles.toggleButtonActive : styles.toggleButtonInactive}`}
            onClick={() => handleToggleMode(true)}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <input type="text" id="nome" placeholder="Nome" value={formData.nome} onChange={handleInputChange} autoComplete="name" className={styles.input} />
          )}

          <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleInputChange} autoComplete="email" className={styles.input} />

          <input type="password" id="senha" placeholder="Senha" value={formData.senha} onChange={handleInputChange} autoComplete={isRegister ? "new-password" : "current-password"} className={styles.input} />

          {isRegister && (
            <input type="password" id="confirmarSenha" placeholder="Confirmar Senha" value={formData.confirmarSenha} onChange={handleInputChange} autoComplete="new-password" className={styles.input} />
          )}

          <button type="submit" className={styles.submitButton}>
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
      </div>

      <div className={imageOrder}>
        <AuthImage isRegister={isRegister} />
      </div>
    </div>
  );
}
