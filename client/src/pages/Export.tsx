import { useLinks } from '@/contexts/LinksContext';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design System: Minimalismo Funcional
 * - Página de exportação de links para backup
 */

export default function Export() {
  const { links } = useLinks();

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ links }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `links-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Links exportados com sucesso!');
  };

  const handleCopyJSON = () => {
    const dataStr = JSON.stringify({ links }, null, 2);
    navigator.clipboard.writeText(dataStr);
    toast.success('JSON copiado para a área de transferência!');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Exportar Links</h1>

        <div className="card-minimal mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Backup de Links</h2>
          <p className="text-muted-foreground mb-6">
            Exporte seus links para fazer backup ou transferir para outro dispositivo.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExportJSON}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar como JSON
            </button>

            <button
              onClick={handleCopyJSON}
              className="w-full px-4 py-2 rounded border border-border text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copiar JSON
            </button>
          </div>
        </div>

        <div className="card-minimal">
          <h2 className="text-xl font-bold text-foreground mb-4">Dados</h2>
          <pre className="bg-secondary p-4 rounded overflow-auto max-h-96 text-sm text-secondary-foreground">
            {JSON.stringify({ links }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
