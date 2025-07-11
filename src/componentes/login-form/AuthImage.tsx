import React from 'react';
import Image from 'next/image';
import styles from './loginForm.module.css';

interface AuthImageProps {
  isRegister: boolean;
}

const AuthImage: React.FC<AuthImageProps> = ({ isRegister }) => {
  const imageSrc = isRegister ? "/Mimic.png" : "/BeholderEsq.png";
  const altText = isRegister ? "Mímico" : "Beholder";

  return (
    <div className={styles.imageContainer}>
      <Image
        src={imageSrc}
        alt={altText}
        width={400}
        height={400}
        className={styles.image}
        priority
      />
    </div>
  );
};

export default AuthImage;
