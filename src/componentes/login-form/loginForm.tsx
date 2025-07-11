'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/componentes/auth/AuthProvider';
import AuthImage from './AuthImage';
import styles from './loginForm.module.css';
import { loginSchema, registerSchema } from '@/lib/schemas';
import { ZodError, ZodIssue } from 'zod';

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});
    const path = register ? '/register' : '/login';
    router.push(path);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = isRegister ? registerSchema : loginSchema;
    try {
      schema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.issues.forEach((err: ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
      return;
    }

    try {
      const endpoint = isRegister
        ? 'http://localhost:5000/api/cadastro'
        : 'http://localhost:5000/api/login';

      const payload = isRegister
        ? {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            confirmarSenha: formData.confirmarSenha,
          }
        : {
            email: formData.email,
            senha: formData.senha,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensagem || 'Erro ao enviar dados');
        return;
      }

      if (isRegister) {
        alert('Cadastro realizado com sucesso! Faça login.');
        router.push('/login');
      } else {
        // Para login, usamos os dados retornados pelo backend
        const userData = {
          id: data.user.id,
          nome: data.user.nome,
          email: data.user.email
        };
        login(data.token, userData);
        router.push('/hub');
      }
    } catch (err) {
      alert('Erro de rede ao enviar dados.');
      console.error(err);
    }
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

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {isRegister && (
            <div className={styles.inputGroup}>
              <input type="text" id="nome" placeholder="Nome" value={formData.nome} onChange={handleInputChange} autoComplete="name" className={styles.input} />
              {errors.nome && <p className={styles.error}>{errors.nome}</p>}
            </div>
          )}

          <div className={styles.inputGroup}>
            <input type="email" id="email" placeholder="Email" value={formData.email} onChange={handleInputChange} autoComplete="email" className={styles.input} />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <input type="password" id="senha" placeholder="Senha" value={formData.senha} onChange={handleInputChange} autoComplete={isRegister ? "new-password" : "current-password"} className={styles.input} />
            {errors.senha && <p className={styles.error}>{errors.senha}</p>}
          </div>

          {isRegister && (
            <div className={styles.inputGroup}>
              <input type="password" id="confirmarSenha" placeholder="Confirmar Senha" value={formData.confirmarSenha} onChange={handleInputChange} autoComplete="new-password" className={styles.input} />
              {errors.confirmarSenha && <p className={styles.error}>{errors.confirmarSenha}</p>}
            </div>
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
