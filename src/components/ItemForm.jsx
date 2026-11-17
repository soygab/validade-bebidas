// Formulário de cadastro: bebida, local, quantidade + unidade, validade.
// Para adicionar um campo novo (ex.: "lote"):
//   1) coloco ele no useState abaixo, 2) crio um <Campo> aqui,
//   3) incluo no onAdd({...}) do enviar().
import { useState } from 'react';
import { OPCOES_UN } from '../constants';
import { Campo, campo } from '../ui';

export default function ItemForm({ locais, onAdd }) {
  // Valores digitados. Começa com o 1º local da lista e unidade "un".
  const [f, setF] = useState({ nome: '', local: locais[0], qtd: 1, un: 'un', val: '' });

  // Atalho: set('nome') devolve o onChange que atualiza só esse campo.
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Se o local escolhido deixou de existir (ex.: importei um backup), volta para o primeiro.
  const local = locais.includes(f.local) ? f.local : locais[0];

  const enviar = (e) => {
    e.preventDefault();
    onAdd({ nome: f.nome.trim(), local, qtd: Number(f.qtd), un: f.un, val: f.val });
    // Limpa só nome e quantidade: local, unidade e validade ficam para cadastrar em sequência.
    setF({ ...f, nome: '', qtd: 1 });
  };

  return (
    // Layout: 2 colunas no celular, 5 colunas em telas médias (md:) para cima.
    // Para mudar as proporções no PC, edito o grid-cols-[...] do md:.
    <form
      onSubmit={enviar}
      className="mb-6 grid grid-cols-2 items-end gap-2.5 rounded-xl border border-line bg-surf p-3.5 md:grid-cols-[2fr_1.3fr_1.4fr_1.2fr_auto]"
    >
      <Campo label="Bebida" className="col-span-2 md:col-span-1">
        <input className={`${campo} w-full`} required value={f.nome} onChange={set('nome')}
          placeholder="Ex.: Heineken long neck" autoComplete="off" />
      </Campo>

      <Campo label="Local">
        <select className={`${campo} w-full`} value={local} onChange={set('local')}>
          {locais.map((l) => <option key={l}>{l}</option>)}
        </select>
      </Campo>

      {/* Quantidade e unidade ficam grudadas (input + select) */}
      <Campo label="Quantidade">
        <span className="flex">
          <input className={`${campo} w-16 flex-none rounded-r-none`} type="number" min="1" required
            value={f.qtd} onChange={set('qtd')} aria-label="Quantidade" />
          {/* As opções vêm de OPCOES_UN (constants.js) */}
          <select className={`${campo} w-full rounded-l-none border-l-0`} value={f.un}
            onChange={set('un')} aria-label="Unidade">
            {OPCOES_UN.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </span>
      </Campo>

      <Campo label="Validade">
        <input className={`${campo} w-full`} type="date" required value={f.val} onChange={set('val')} />
      </Campo>

      <button type="submit"
        className="col-span-2 rounded-md bg-ink px-4 py-2.5 font-semibold text-inkx md:col-span-1">
        Adicionar
      </button>
    </form>
  );
}
