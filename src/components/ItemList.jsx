// Container da lista. Só repete o ItemRow para cada item
// e mostra a mensagem "vazio" quando não tem nada para mostrar.
// (O texto da mensagem é definido no App.jsx.)
import ItemRow from './ItemRow';

export default function ItemList({ itens, vazio, ...acoes }) {
  // ...acoes = alerta, onAjustar, onRemover: repassados direto para cada linha
  return (
    <ul className="overflow-hidden rounded-xl border border-line bg-surf">
      {itens.length ? (
        itens.map((i) => <ItemRow key={i.id} item={i} {...acoes} />)
      ) : (
        <li className="p-7 text-center text-mut">{vazio}</li>
      )}
    </ul>
  );
}
