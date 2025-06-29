import Head from "next/head"
import Link from "next/link"
import "@/styles/globals.css"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col py-4">
      <Head>
        <title>Otimização de Rotas</title>
        <meta name="description" content="Sistema para otimização de rotas usando grafos" />
      </Head>
      <main className="flex flex-col items-center justify-items-center">
        <h3 className="text-center">Projeto - Programação Linear</h3>
        <div className="flex flex-col items-center justify-center justify-items-center gap-6 my-2">
          <Link href="/metodos-basicos"><button className="min-w-sm">Métodos Básicos</button></Link>
          <Link href="/algoritmos-geneticos"><button className="min-w-sm">Algoritmos Genéticos</button></Link>
          <Link href="/sobre-sistema"><button className="min-w-sm">Sobre o Sistema</button></Link>
        </div>
      </main>
    </div>
  )
}