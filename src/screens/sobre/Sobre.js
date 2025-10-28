import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";

import OndaRodape from "../../assets/ondaPrincipal.svg";

const botoes = [
  {
    nome: "Notícias",
    descricao:
      "A seção de notícias traz informações sobre cultura, eventos, oportunidades e acontecimentos das comunidades periféricas. Nosso foco é dar visibilidade a vozes e histórias que merecem ser ouvidas.",
    icone: "📰",
  },
  {
    nome: "Doações",
    descricao:
      "Aqui você pode visualizar ou divulgar campanhas de doação. É o espaço para conectar quem precisa com quem pode ajudar, fortalecendo o apoio mútuo dentro da comunidade.",
    icone: "🤝",
  },
  {
    nome: "Vagas",
    descricao:
      "Na aba de vagas, reunimos oportunidades de emprego, estágios e cursos gratuitos. O objetivo é facilitar o acesso a chances reais de crescimento profissional.",
    icone: "💼",
  },
];

export default function SobreNos() {
  const [ativo, setAtivo] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Header />
      <main className="flex-1 flex flex-col items-center text-center mt-6 px-4">
        {/* Imagem principal */}
        <img
          src="https://blogperic0.blob.core.windows.net/imgsp/skyscraperssunset1.png"
          alt="Cidade"
          className="w-full max-w-[500px] rounded-2xl shadow-md mb-6"
        />

        {/* Título */}
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-[#AE0000] mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre Nós
        </motion.h1>

        {/* Texto introdutório */}
        <p className="text-gray-700 max-w-[600px] mb-8">
          O <span className="font-semibold text-[#AE0000]">Blog Periférico</span> é um projeto criado
          para aproximar informação, oportunidade e solidariedade das comunidades periféricas de São Paulo.
          Nosso objetivo é ser um canal de comunicação acessível, útil e acolhedor.
        </p>

        {/* Botões interativos */}
        <div className="flex flex-col gap-4 w-full max-w-[400px]">
          {botoes.map((botao, index) => (
            <motion.button
              key={index}
              onClick={() => setAtivo(ativo === index ? null : index)}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center justify-center gap-3 py-3 rounded-xl shadow-md font-semibold text-lg transition-all 
              ${ativo === index ? "bg-[#AE0000] text-white" : "bg-white text-[#AE0000] border border-[#AE0000]"}`}
            >
              <span className="text-2xl">{botao.icone}</span>
              {botao.nome}
            </motion.button>
          ))}
        </div>

        {/* Texto animado */}
        <AnimatePresence mode="wait">
          {ativo !== null && (
            <motion.div
              key={ativo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-white rounded-2xl shadow-md p-4 max-w-[500px] border-t-4 border-[#AE0000]"
            >
              <p className="text-gray-700">{botoes[ativo].descricao}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      
    </div>
  );
}
