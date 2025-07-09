'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useProtectedRoute } from '@/componentes/auth/AuthProvider';

interface Ficha {
  id: string;
  nome: string;
  sistema: string;
  nivel?: string;
  classe?: string;
  sanidade?: string;
  cla?: string;
}

export default function HubPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const { user, logout } = useAuth();
  const { isAuthenticated, loading } = useProtectedRoute();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserFichas();
    }
  }, [isAuthenticated, user]);

  const fetchUserFichas = async () => {
    try {
      // Dados mockados - substitua pela API real
      setFichas([
        {
          id: '1',
          nome: 'D&D - Teste',
          sistema: 'dnd',
          nivel: '5',
          classe: 'Maga'
        },
        {
          id: '2',
          nome: 'Cyberpunk - Teste',
          sistema: 'cyberpunk',
          classe: 'Netrunner'
        },
        {
          id: '3',
          nome: 'Call of Cthulhu - Teste',
          sistema: 'cthulhu',
          sanidade: '47%'
        },
        {
          id: '4',
          nome: 'Vampiro - Teste',
          sistema: 'vampiro',
          cla: 'Toreador'
        }
      ]);
    } catch (error) {
      console.error('Erro ao buscar fichas:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getCardStyle = (sistema: string) => {
    const baseStyle = "p-6 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer";
    
    switch (sistema) {
      case 'dnd':
        return `${baseStyle} bg-gradient-to-br from-red-600 to-red-800 text-white`;
      case 'cyberpunk':
        return `${baseStyle} bg-gradient-to-br from-cyan-600 to-purple-800 text-white`;
      case 'cthulhu':
        return `${baseStyle} bg-gradient-to-br from-green-800 to-black text-white`;
      case 'vampiro':
        return `${baseStyle} bg-gradient-to-br from-red-900 to-black text-white`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-600 to-gray-800 text-white`;
    }
  };

  const renderFichaInfo = (ficha: Ficha) => {
    if (ficha.nivel && ficha.classe) {
      return `Nível ${ficha.nivel} • ${ficha.classe}`;
    }
    if (ficha.classe) {
      return `Classe: ${ficha.classe}`;
    }
    if (ficha.sanidade) {
      return `Sanidade: ${ficha.sanidade}`;
    }
    if (ficha.cla) {
      return `Clã: ${ficha.cla}`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white">
            Suas fichas, {user?.nome || 'Usuário'}!
          </h1>
          <div className="space-x-4">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Início
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Grid de Fichas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fichas.map((ficha) => (
            <div
              key={ficha.id}
              className={getCardStyle(ficha.sistema)}
              onClick={() => router.push(`/ficha/${ficha.id}`)}
            >
              <h2 className="text-xl font-bold mb-2">{ficha.nome}</h2>
              <p className="text-gray-200">{renderFichaInfo(ficha)}</p>
            </div>
          ))}
          
          {/* Card Nova Ficha */}
          <div
            className="p-6 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer bg-gradient-to-br from-green-600 to-green-800 text-white border-2 border-dashed border-green-400 flex items-center justify-center min-h-[120px]"
            onClick={() => router.push('/ficha/nova')}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">+</div>
              <span className="text-lg font-medium">Nova Ficha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
