// Pedaços de interface que eu reaproveito em vários componentes.
// Se eu quiser mudar o visual de TODOS os inputs ou chips de uma vez, mexo aqui.

// Classes padrão de input/select. Uso assim: className={`${campo} w-full`}
// (a largura eu defino em cada lugar, porque muda de tela para tela).
export const campo =
  'min-w-0 rounded-md border border-line bg-surf px-2.5 py-2 text-tx placeholder:text-mut';

// Rótulo + campo empilhados (texto pequeno cinza em cima do input).
export const Campo = ({ label, className = '', children }) => (
  <label className={`flex flex-col gap-1 text-sm text-mut ${className}`}>
    {label}
    {children}
  </label>
);

// Botão arredondado de filtro. "ativo" = selecionado (fica com a cor principal).
export const Chip = ({ ativo, className = '', ...props }) => (
  <button
    type="button"
    aria-pressed={ativo}
    className={`rounded-full border px-3 py-1 ${
      ativo ? 'border-ink bg-ink text-inkx' : 'border-line text-tx'
    } ${className}`}
    {...props}
  />
);
