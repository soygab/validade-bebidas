// Abas com contador: Todos | Vencidos | Vencem logo | No prazo.
// Os nomes e cores vêm de STATUS (constants.js). Se eu criar um status novo lá,
// a aba aparece aqui sozinha.
import { STATUS } from '../constants';

// Monta a lista de abas: "Todos" primeiro, depois um item por status.
const ABAS = [['todos', 'Todos', ''], ...Object.entries(STATUS).map(([k, s]) => [k, s.label, s.txt])];

// ativa = aba selecionada | onChange = troca de aba | contagem = { todos, v, a, o }
export default function Abas({ ativa, onChange, contagem }) {
  return (
    <div className="flex gap-5 overflow-x-auto border-b-2 border-line">
      {ABAS.map(([k, label, cor]) => (
        <button key={k} type="button" aria-pressed={ativa === k} onClick={() => onChange(k)}
          className={`-mb-0.5 whitespace-nowrap border-b-[3px] py-2 font-semibold ${
            ativa === k ? 'border-tx text-tx' : 'border-transparent text-mut'
          }`}>
          {label}
          {/* número colorido de cada aba */}
          <b className={`ml-1.5 font-cond text-xl ${cor}`}>{contagem[k]}</b>
        </button>
      ))}
    </div>
  );
}
