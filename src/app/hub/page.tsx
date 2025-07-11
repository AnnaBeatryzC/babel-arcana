'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useProtectedRoute } from '@/componentes/auth/AuthProvider';
import Footer from '@/componentes/Footer/Footer';
import GlassCard from '@/componentes/GlassCard/GlassCard';

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
      console.log('Dados do usuário no Hub:', user); // Debug temporário
      fetchUserFichas();
    }
  }, [isAuthenticated, user]);

  const fetchUserFichas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3002/api/fichas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar fichas');

      const data = await res.json();
      setFichas(data);
    } catch (error) {
      console.error('Erro ao buscar fichas:', error);
      alert('Erro ao carregar fichas.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getCardStyle = (sistema: string) => {
    const baseStyle = "p-6 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer";
    
    switch (sistema) {
      case 'dnd':
        return `${baseStyle} bg-gradient-to-br from-red-600 to-red-800 text-black`;
      case 'cyberpunk':
        return `${baseStyle} bg-gradient-to-br from-cyan-600 to-purple-800 text-black`;
      case 'cthulhu':
        return `${baseStyle} bg-gradient-to-br from-green-800 to-black text-black`;
      case 'vampiro':
        return `${baseStyle} bg-gradient-to-br from-red-900 to-black text-black`;
      default:
        return `${baseStyle} bg-gradient-to-br from-gray-600 to-gray-800 text-black`;
    }
  };

  const renderFichaInfo = (ficha: Ficha) => {
    if (ficha.nivel && ficha.classe) return `Nível ${ficha.nivel} • ${ficha.classe}`;
    if (ficha.classe) return `Classe: ${ficha.classe}`;
    if (ficha.sanidade) return `Sanidade: ${ficha.sanidade}`;
    if (ficha.cla) return `Clã: ${ficha.cla}`;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex flex-col">
      <div className="max-w-6xl mx-auto flex-grow">
        <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-black">
              Suas fichas, {user?.nome || 'Usuário'}!
            </h1>
              <div className="flex gap-3 ml-4">
                <Link 
                  href="/"
                  className="bg-blue-300 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Início
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-300 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sair
                </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fichas.map((ficha) => (
              <div
                key={ficha.id}
                className={getCardStyle(ficha.sistema)}
                onClick={() => router.push(`/ficha/${ficha.id}`)}
              >
                <h2 className="text-xl font-bold mb-2 text-black">{ficha.nome}</h2>
                <p className="text-gray-800">{renderFichaInfo(ficha)}</p>
              </div>
            ))}
            
            <div
              className="p-6 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer bg-gradient-to-br from-green-600 to-green-800 text-white border-2 border-dashed border-green-400 flex items-center justify-center min-h-[120px]"
              onClick={() => router.push('/ficha/nova')}
            >
              <div className="text-center">
                <div className="text-4xl mb-2 text-black">+</div>
                <span className="text-lg font-medium text-black">Nova Ficha</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      <Footer />
    </div>
  );
}