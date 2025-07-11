/*==============================================================================
** Pagina inicial, uma landing page
** Função do Index para conseguir acesso ao Login / Cadastro
================================================================================*/
import Image from "next/image";
import CardIni from "@/componentes/textbox-index/card-ini";
import Footer from '@/componentes/Footer/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="relative w-[100%] h-[80vh]">
          <Image
            className="bg-white dark:bg-black object-cover"
            src="/livro-inicio.png"
            alt="Imagem de fundo de teste"
            fill
            priority
          />
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <CardIni />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
