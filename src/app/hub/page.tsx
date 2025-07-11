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
      const res = await fetch('http://localhost:5000/api/fichas', {
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
        return `${baseStyle} bg-var(--dark-indigo) text-white`;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-y-scroll">
      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold" style={{ color: 'var(--gold)' }}>
                Suas fichas, {user?.nome || 'Usuário'}!
              </h1>
                <div className="flex gap-3 ml-4">
                  <Link 
                    href="/"
                    className="font-['Cinzel'] font-bold text-lg px-5 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--gold)',
                      color: 'var(--dark-brown)',
                      boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--light-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gold)';
                    }}
                  >
                    Início
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="font-['Cinzel'] font-bold text-lg px-5 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{
                      backgroundColor: 'var(--crimson)',
                      color: 'var(--white)',
                      boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#df1b38ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--crimson)';
                    }}
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
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--gold)' }}>{ficha.nome}</h2>
                  <p className="text-gray-800">{renderFichaInfo(ficha)}</p>
                </div>
              ))}
              
                <div
                  className="p-6 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer border-2 border-dashed flex items-center justify-center min-h-[120px]"
                  style={{
                  backgroundColor: '#541A57',
                  borderColor: '#481C52'
                  }}
                  onClick={() => router.push('/ficha/nova')}
                >
                  <div className="text-center">
                  <div className="text-4xl mb-2 font-['Cinzel']" style={{ color: 'var(--gold)' }}>+</div>
                  <span className="text-lg font-bold font-['Cinzel']" style={{ color: 'var(--gold)' }}>Nova Ficha</span>
                  </div>
                </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}