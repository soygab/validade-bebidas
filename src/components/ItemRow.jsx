// Uma linha da lista: bloco colorido da data | nome, local e status | quantidade com − e +.
// Para mudar o que aparece em cada linha, é aqui.
import { useState } from 'react';
import { STATUS, UNIDADES } from '../constants';
import { diasAte, partesData, statusDe, textoDias } from '../utils/dates';
import { nomePessoa } from '../utils/pessoa';

// Visual dos botões − e +
const passo = 'h-[38px] w-[38px] rounded-md border border-line bg-bg text-xl';

export default function ItemRow({ item, alerta, onAjustar, onRemover }) {
  // Remover precisa de 2 cliques: o 1º só pede confirmação, o 2º apaga.
  const [confirmar, setConfirmar] = useState(false);

  const s = STATUS[statusDe(item.val, alerta)];            // classes de cor deste item
  const { dia, mes, ano } = partesData(item.val);           // partes da data
  // "unidade/unidades", "fardo/fardos"... (itens antigos sem "un" contam como unidade)
  const unidade = UNIDADES[item.un || 'un'][item.qtd === 1 ? 0 : 1];

  return (
    // 3 colunas: 64px do bloco da data | espaço flexível | botões de quantidade
    <li className="grid grid-cols-[64px_1fr_auto] border-t border-line first:border-t-0">
      {/* Bloco da data, colorido pelo status */}
      <div className={`flex flex-col items-center justify-center py-2 ${s.stub}`}>
        <b className="font-cond text-3xl leading-none">{dia}</b>
        <small className="text-xs font-semibold">{mes} {ano}</small>
      </div>

      {/* Nome, local e status */}
      <div className="min-w-0 px-3.5 py-2.5">
        <div className="text-[1.05rem] font-semibold">{item.nome}</div>
        {/* Local e quem cadastrou (vem da coluna "por" do banco) */}
        <div className="text-sm text-mut">{item.local}{item.por ? ` · por ${nomePessoa(item.por)}` : ''}</div>
        <div className="mt-0.5 flex items-center gap-3.5">
          <span className={`text-sm font-semibold ${s.txt}`}>{textoDias(diasAte(item.val))}</span>
          <button type="button" className="text-sm text-mut underline"
            onClick={() => (confirmar ? onRemover(item.id) : setConfirmar(true))}
            onBlur={() => setConfirmar(false)}>
            {confirmar ? 'Confirmar remoção' : 'Remover'}
          </button>
        </div>
      </div>

      {/* Quantidade: − número + (chegando a 0 o item some, ver "ajustar" no useEstoque) */}
      <div className="flex items-center gap-0.5 pr-2">
        <button type="button" className={passo} aria-label="Diminuir" onClick={() => onAjustar(item.id, -1)}>−</button>
        <div className="min-w-[62px] text-center leading-tight">
          <b className="block font-cond text-2xl">{item.qtd}</b>
          <small className="text-[0.8rem] text-mut">{unidade}</small>
        </div>
        <button type="button" className={passo} aria-label="Aumentar" onClick={() => onAjustar(item.id, 1)}>+</button>
      </div>
    </li>
  );
}
