'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/componentes/auth/AuthProvider';

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
    // Se estiver na página de registro, ativar modo registro
    if (pathname === '/register') {
      setIsRegister(true);
    }
  }, [pathname]);

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para o hub
    if (isAuthenticated) {
      router.push('/hub');
    }
  }, [isAuthenticated, router]);

  const handleToggleMode = (register: boolean) => {
    setIsRegister(register);
    // Navegar para a URL apropriada
    if (register) {
      router.push('/register');
    } else {
      router.push('/login');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
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
      // Simular cadastro bem-sucedido
      const userData = {
        id: '1',
        nome: formData.nome,
        email: formData.email
      };
      const token = 'mock-token-' + Date.now();
      
      login(token, userData);
      router.push('/hub');
    } else {
      // Simular login bem-sucedido
      const userData = {
        id: '1',
        nome: 'Usuário Teste',
        email: formData.email
      };
      const token = 'mock-token-' + Date.now();
      
      login(token, userData);
      router.push('/hub');
    }

    // TODO: Implementar lógica real de autenticação
    /* 
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(isRegister ? formData : { email: formData.email, senha: formData.senha })
      });

      if (!response.ok) {
        throw new Error('Erro na autenticação');
      }

      const data = await response.json();
      login(data.token, data.user);
      router.push('/hub');
    } catch (error) {
      alert('Erro ao fazer login/cadastro');
    }
    */
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="flex items-center text-white text-4xl font-bold mb-8">
        <Image 
          src="/img/d20.png" 
          alt="d20" 
          width={40} 
          height={40} 
          className="mr-2"
        />
        Fichas RPG
      </h1>

      <div className="form-toggle mb-6">
        <button
          type="button"
          className={`px-6 py-2 mr-2 rounded-lg font-medium transition-colors ${
            !isRegister 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          onClick={() => handleToggleMode(false)}
        >
          Login
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isRegister 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
          onClick={() => handleToggleMode(true)}
        >
          Cadastrar
        </button>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        {isRegister && (
          <input
            type="text"
            id="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleInputChange}
            autoComplete="name"
            className="px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
          className="px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="password"
          id="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleInputChange}
          autoComplete={isRegister ? "new-password" : "current-password"}
          className="px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {isRegister && (
          <input
            type="password"
            id="confirmarSenha"
            placeholder="Confirmar Senha"
            value={formData.confirmarSenha}
            onChange={handleInputChange}
            autoComplete="new-password"
            className="px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        <button 
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isRegister ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
