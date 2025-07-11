import React from 'react';
import Link from 'next/link';
import GlassCard from '@/componentes/GlassCard/GlassCard';
import styles from './cardIni.module.css';

export default function CardIni() {
  return (
    <GlassCard className={styles.cardIniGlassCard}>
      <h1 className={styles.title}>
        Babel<br />Arcana
      </h1>
      <p className={styles.description}>Bem vindo ao nosso armazém de fichas!</p>
      <div className={styles.buttonContainer}>
        <Link
          className={`${styles.button} ${styles.buttonPrimary}`}
          href="/login"
        >
          Login
        </Link>
        <Link
          className={`${styles.button} ${styles.buttonSecondary}`}
          href="/register"
        >
          Registrar
        </Link>
      </div>
    </GlassCard>
  );
}