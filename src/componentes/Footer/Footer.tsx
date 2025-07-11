import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Image
          src="/d20.png"
          alt="D20 Dice"
          width={120} // Tamanho médio para o dado
          height={120}
          className={styles.d20Icon}
        />
        <p className={styles.text}>
          Feito com muito <a href="https://github.com/AnnaBeatryzC/babel-arcana.git" target="_blank" rel="noopener noreferrer" className={styles.heartLink}><span className={styles.heart}>❤️</span></a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
