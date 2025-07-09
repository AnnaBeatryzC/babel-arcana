import React from 'react';
import Link from 'next/link';
import styles from '../../app/styles/glass-card.module.css'; 

export default function CardIni() {
  return (
    <div className={styles.glassCard}>
      <h1 className="text-2xl font-bold mb-4">Babel Arcana</h1>
      <p className="text-lg mb-6">Bem vindo ao nosso armazém de fichas!</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
          href="/register"
        >
          Registrar
        </Link>
      </div>
    </div>
  );
}