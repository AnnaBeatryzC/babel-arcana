import styles from './NotFound.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <video autoPlay muted loop className={styles.videoBackground}>
        <source src="/dadoPreto.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.textBox}>
        
        <h1>Eita! Você tirou um erro crítico...</h1>
        {/* <p>Você rolou um 1 no dado e essa página desapareceu do mapa.</p> */}
        <p>Isso foi tipo conjurar <em style={{ color: '#E6A545' }}>Meteor Swarm</em> numa taverna cheia e... errar todos os alvos.</p>
        <br />
        <p>
          Mas calma! Use sua ação bônus para voltar pra home e tentar de novo.
        </p>
        <Image
          src="/miniMago.png"
          alt="personagem com a classe mago "
          width={100}
          height={100}
          className={styles.diceImage}
        />
        <Link href="/" className={styles.backButton}>
          Voltar para a torre de Babel
        </Link>
      </div>
    </div>
  );
}
