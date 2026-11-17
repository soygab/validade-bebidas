// Seção recolhível no final: dias do alerta + exportar/importar backup.
// "dados" é o objeto { itens, locais, alerta } que o App manda inteiro.
import { Campo, campo } from '../ui';

export default function Configuracoes({ dados, onAlerta, onImportar }) {
  // Baixa um arquivo .json com tudo. Para mudar o nome do arquivo, edito a linha do a.download.
  const exportar = () => {
    const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'validade-bebidas.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Lê o arquivo escolhido e manda para o useEstoque validar e salvar.
  const importar = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const r = new FileReader();
    r.onload = () => { try { onImportar(JSON.parse(r.result)); } catch { /* json inválido: ignora */ } };
    r.readAsText(arquivo);
    e.target.value = ''; // permite escolher o mesmo arquivo de novo depois
  };

  const botao = 'cursor-pointer rounded-md border border-line bg-surf px-3.5 py-2 text-tx';

  return (
    <details className="mt-6 text-[0.92rem] text-mut">
      <summary className="cursor-pointer">Configurações e backup</summary>
      <div className="my-2.5 flex flex-wrap items-end gap-2.5">
        {/* Dias para o status amarelo ("vence logo"). Limite de 1 a 90 no min/max. */}
        <Campo label="Alertar quando faltar (dias)" className="max-w-[200px]">
          <input className={campo} type="number" min="1" max="90" value={dados.alerta}
            onChange={(e) => onAlerta(e.target.value)} />
        </Campo>
        <button type="button" className={botao} onClick={exportar}>Exportar backup</button>
        <label className={botao}>
          Importar backup
          <input type="file" accept=".json" hidden onChange={importar} />
        </label>
      </div>
      <p>Os dados ficam salvos só neste navegador. Use o backup para levar para outro aparelho.</p>
    </details>
  );
}
