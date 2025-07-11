'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/componentes/Footer/Footer';
import GlassCard from '@/componentes/GlassCard/GlassCard';

interface FichaDetalhes {
  id: string;
  nome: string;
  sistema: string;
  nivel?: number;
  classe?: string;
  raca?: string;
  sanidade?: number;
  cla?: string;
  atributos?: {
    [key: string]: number;
  };
  habilidades?: string[];
}

export default function FichaPage() {
  const [ficha, setFicha] = useState<FichaDetalhes | null>(null);
  const [racasDisponiveis, setRacasDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const fichaId = params.id as string;

  const fetchFichaData = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/fichas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Ficha não encontrada ou não autorizada');
      }

      const fichaData = await res.json();
      setFicha(fichaData);
    } catch (error) {
      console.error('Erro ao buscar ficha:', error);
      alert('Erro ao carregar ficha.');
      router.push('/hub');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      if (fichaId === 'nova') {
        // Modo de criação de nova ficha
        setFicha({
          id: 'nova',
          nome: '',
          sistema: 'dnd',
          nivel: 1,
          classe: '',
          raca: '',
          atributos: {
            forca: 10,
            destreza: 10,
            constituicao: 10,
            inteligencia: 10,
            sabedoria: 10,
            carisma: 10
          },
          habilidades: []
        });
        setEditMode(true);
        setLoading(false);
      } else {
        await fetchFichaData(fichaId);
      }
    };

    const fetchRacas = async () => {
      try {
        const res = await fetch('https://www.dnd5eapi.co/api/races');
        const data = await res.json();
        const nomes = data.results.map((r: { name: string }) => r.name);
        setRacasDisponiveis(nomes);
      } catch (error) {
        console.error('Erro ao carregar raças da API externa:', error);
      }
    };

    fetchRacas();

    fetchData();
  }, [fichaId, router, fetchFichaData]);

  const handleSave = async () => {
    if (!ficha) return;

    try {
      const token = localStorage.getItem('token');
      const method = fichaId === 'nova' ? 'POST' : 'PUT';
      const url = fichaId === 'nova'
        ? 'http://localhost:5000/api/fichas'
        : `http://localhost:5000/api/fichas/${fichaId}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ficha)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensagem || 'Erro ao salvar ficha.');
        return;
      }

      alert(fichaId === 'nova' ? 'Nova ficha criada com sucesso!' : 'Ficha atualizada com sucesso!');
      router.push('/hub');
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      alert('Erro ao salvar ficha.');
    }
  };

  const handleDelete = async () => {
    if (!ficha || fichaId === 'nova') return;

    if (confirm('Tem certeza que deseja excluir esta ficha?')) {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:5000/api/fichas/${fichaId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.mensagem || 'Erro ao excluir ficha.');
          return;
        }

        alert('Ficha excluída com sucesso!');
        router.push('/hub');
      } catch (error) {
        console.error('Erro ao excluir ficha:', error);
        alert('Erro ao excluir ficha.');
      }
    }
  };

  const updateFicha = (campo: string, valor: string | number) => {
    if (!ficha) return;
    setFicha({
      ...ficha,
      [campo]: valor
    });
  };

  const updateAtributo = (atributo: string, valor: number) => {
    if (!ficha) return;
    setFicha({
      ...ficha,
      atributos: {
        ...ficha.atributos,
        [atributo]: valor
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando ficha...</div>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Ficha não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
          <div className="flex justify-between items-center mb-8 pt-8">
            <div className="flex items-center space-x-4">
              <Link 
                href="/hub"
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
                ← Voltar
              </Link>
              <h1 className="text-3xl font-bold text-black">
                {editMode ? 
                  <input
                    type="text"
                    value={ficha.nome}
                    onChange={(e) => updateFicha('nome', e.target.value)}
                    className="bg-white/10 text-black px-3 py-1 rounded border-none outline-none"
                    placeholder="Nome da ficha"
                  />
                  : ficha.nome
                }
              </h1>
            </div>
            
            <div className="space-x-2">
              {editMode ? (
                <>
                  <button 
                    onClick={handleSave}
<<<<<<< Updated upstream
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
                    className="font-['Cinzel'] font-bold text-lg px-5 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{
                      backgroundColor: '#10b981', // green-500
                      color: 'var(--white)',
                      boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'; // green-600
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                    }}
>>>>>>> Stashed changes
                  >
                    Salvar
                  </button>
                  <button 
                    onClick={() => setEditMode(false)}
<<<<<<< Updated upstream
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
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
>>>>>>> Stashed changes
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setEditMode(true)}
<<<<<<< Updated upstream
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
                    className="font-['Cinzel'] font-bold text-lg px-5 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{
                      backgroundColor: '#3b82f6', // blue-500
                      color: 'var(--white)',
                      boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb'; // blue-600
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                    }}
>>>>>>> Stashed changes
                  >
                    Editar
                  </button>
                  {fichaId !== 'nova' && (
                    <button 
                      onClick={handleDelete}
<<<<<<< Updated upstream
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
=======
                      className="font-['Cinzel'] font-bold text-lg px-5 py-3 rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                      style={{
                        backgroundColor: 'var(--crimson)',
                        color: 'var(--white)',
                        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff4757';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--crimson)';
                      }}
>>>>>>> Stashed changes
                    >
                      Excluir
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Conteúdo da Ficha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-black mb-4">Informações Básicas</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-800 mb-1">Sistema:</label>
                  {editMode ? (
                    <select
                      value={ficha.sistema}
                      onChange={(e) => updateFicha('sistema', e.target.value)}
                      className="w-full bg-white/10 text-black px-3 py-2 rounded border border-gray-600 outline-none"
                    >
                      <option value="dnd">D&D 5e</option>
                      {/* <option value="cyberpunk">Cyberpunk 2020</option>
                      <option value="cthulhu">Call of Cthulhu</option>
                      <option value="vampiro">Vampiro: A Máscara</option> */}
                    </select>
                  ) : (
                    <p className="text-black">{ficha.sistema}</p>
                  )}
                </div>
                
                {ficha.sistema === 'dnd' && (
                  <>
                    <div>
                      <label className="block text-gray-800 mb-1">Nível:</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={ficha.nivel || 1}
                          onChange={(e) => updateFicha('nivel', parseInt(e.target.value))}
                          className="w-full bg-white/10 text-black px-3 py-2 rounded border border-gray-600 outline-none"
                        />
                      ) : (
                        <p className="text-black">{ficha.nivel}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-800 mb-1">Classe:</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={ficha.classe || ''}
                          onChange={(e) => updateFicha('classe', e.target.value)}
                          className="w-full bg-white/10 text-black px-3 py-2 rounded border border-gray-600 outline-none"
                        />
                      ) : (
                        <p className="text-black">{ficha.classe}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-800 mb-1">Raça:</label>
                      {editMode ? (
                        <select
                          value={ficha.raca || ''}
                          onChange={(e) => updateFicha('raca', e.target.value)}
                          className="w-full bg-white/10 text-black px-3 py-2 rounded border border-gray-600 outline-none"
                        >
                          <option value="">Selecione uma raça</option>
                          {racasDisponiveis.map((raca) => (
                            <option key={raca} value={raca}>
                              {raca}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-black">{ficha.raca}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Atributos */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-black mb-4">Atributos</h2>
              <div className="grid grid-cols-2 gap-3">
                {ficha.atributos && Object.entries(ficha.atributos).map(([atributo, valor]) => (
                  <div key={atributo}>
                    <label className="block text-gray-800 mb-1 capitalize">{atributo}:</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={valor}
                        onChange={(e) => updateAtributo(atributo, parseInt(e.target.value))}
                        className="w-full bg-white/10 text-black px-3 py-2 rounded border border-gray-600 outline-none"
                      />
                    ) : (
                      <p className="text-black text-lg font-bold">{valor}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Habilidades */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-black mb-4">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {ficha.habilidades?.map((habilidade, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {habilidade}
                  </span>
                ))}
                {(!ficha.habilidades || ficha.habilidades.length === 0) && (
                  <p className="text-gray-800">Nenhuma habilidade cadastrada</p>
                )}
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