import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { useLocation } from 'wouter';
import { Plus, Trash2, Copy, LogOut } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design System: Minimalismo Funcional
 * - Grid assimétrico: 70% conteúdo, 30% sidebar
 * - Cards com sombra sutil e hover effect
 * - Tipografia: Poppins Bold para títulos, Inter Regular para corpo
 * - Cores: Azul vibrante para CTAs, cinza para secundário
 */

export default function Dashboard() {
  const { logout } = useAuth();
  const { links, addLink, deleteLink } = useLinks();
  const [, setLocation] = useLocation();
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      toast.error('A URL deve começar com http:// ou https://');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      addLink(targetUrl);
      toast.success('Link criado com sucesso!');
      setTargetUrl('');
    } catch (error) {
      toast.error('Erro ao criar link');
    }

    setIsLoading(false);
  };

  const handleDeleteLink = (id: string) => {
    deleteLink(id);
    toast.success('Link removido com sucesso');
  };

  const handleCopyLink = (shortCode: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/r/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-foreground">Link Redirector</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 70% */}
          <div className="lg:col-span-2">
            {/* Add Link Form */}
            <div className="card-minimal mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Criar Novo Link</h2>
              <form onSubmit={handleAddLink} className="flex gap-3">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://exemplo.com/pagina"
                  className="input-minimal flex-1"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !targetUrl}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Criar
                </button>
              </form>
            </div>

            {/* Links List */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Seus Links</h2>
              {links.length === 0 ? (
                <div className="card-minimal text-center py-12">
                  <p className="text-muted-foreground">Nenhum link criado ainda.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie seu primeiro link usando o formulário acima.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="card-minimal flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-mono">
                            {link.shortCode}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            {link.clicks} {link.clicks === 1 ? 'clique' : 'cliques'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.targetUrl}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criado em {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyLink(link.shortCode)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Copiar link"
                        >
                          <Copy className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 hover:bg-destructive hover:bg-opacity-10 rounded transition-colors"
                          title="Deletar link"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 30% */}
          <div className="lg:col-span-1">
            <div className="card-minimal sticky top-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Informações</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Links</p>
                  <p className="text-2xl font-bold text-primary">{links.length}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Cliques</p>
                  <p className="text-2xl font-bold text-primary">
                    {links.reduce((sum, link) => sum + link.clicks, 0)}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Como usar:</strong>
                  </p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Insira a URL de destino</li>
                    <li>Clique em "Criar"</li>
                    <li>Copie o link gerado</li>
                    <li>Compartilhe o link</li>
                  </ol>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>URL Base:</strong><br />
                    <code className="bg-secondary text-secondary-foreground px-1 rounded text-xs">
                      {window.location.origin}/r/
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
