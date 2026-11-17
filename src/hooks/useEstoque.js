// Hook que guarda TODOS os dados do app (itens, locais, dias de alerta)
// e salva no localStorage sempre que algo muda.
// Se um dia eu trocar o localStorage por um backend/API, é só este arquivo que muda:
// os componentes só chamam as funções que ele devolve.
import { useEffect, useState } from 'react';
import { LOCAIS_PADRAO, STORAGE_KEY } from '../constants';

// Estado inicial (primeira vez que abro o app).
// Cada item é: { id, nome, local, qtd, un, val } (val no formato 'AAAA-MM-DD')
const INICIAL = { itens: [], locais: LOCAIS_PADRAO, alerta: 7 };

// Lê o que estava salvo. Se não tiver nada (ou o storage falhar), usa o INICIAL.
function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INICIAL, ...JSON.parse(raw) } : INICIAL;
  } catch {
    return INICIAL;
  }
}

// Gera um id único simples para cada item.
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function useEstoque() {
  const [s, setS] = useState(carregar);

  // Toda vez que "s" muda, salva no navegador.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* sem storage, segue sem salvar */ }
  }, [s]);

  return {
    ...s, // itens, locais, alerta

    // Cadastra um item novo (o formulário manda nome, local, qtd, un e val).
    adicionar: (item) => setS((p) => ({ ...p, itens: [...p.itens, { ...item, id: novoId() }] })),

    // Cadastra vários de uma vez (usado pela importação de texto).
    // O índice (k) no id evita ids repetidos quando todos nascem no mesmo milissegundo.
    // Locais que apareceram no texto e ainda não existiam são criados junto.
    adicionarVarios: (lista) =>
      setS((p) => ({
        ...p,
        locais: [...new Set([...p.locais, ...lista.map((i) => i.local)])],
        itens: [...p.itens, ...lista.map((i, k) => ({ ...i, id: novoId() + k }))],
      })),

    // Soma ou subtrai quantidade (delta = +1 ou -1).
    // Se chegar a 0, o item é removido automaticamente (.filter no final).
    ajustar: (id, delta) =>
      setS((p) => ({
        ...p,
        itens: p.itens.map((i) => (i.id === id ? { ...i, qtd: i.qtd + delta } : i)).filter((i) => i.qtd > 0),
      })),

    // Apaga o item de vez.
    remover: (id) => setS((p) => ({ ...p, itens: p.itens.filter((i) => i.id !== id) })),

    // Adiciona um local novo (ignora se já existir).
    novoLocal: (nome) => setS((p) => (p.locais.includes(nome) ? p : { ...p, locais: [...p.locais, nome] })),

    // Muda os dias do alerta amarelo. Mínimo 1; valor inválido volta para 7.
    setAlerta: (n) => setS((p) => ({ ...p, alerta: Math.max(1, Number(n) || 7) })),

    // Importa um backup JSON (só aceita se tiver "itens" e "locais").
    importar: (d) => {
      if (Array.isArray(d?.itens) && Array.isArray(d?.locais)) setS((p) => ({ ...p, ...d }));
    },
  };
}
