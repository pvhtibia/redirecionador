import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLinks } from '@/contexts/LinksContext';
import { useLocation } from 'wouter';
import { Plus, Trash2, Copy, LogOut, Edit2, X, Check, Download } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design System: Minimalismo Funcional
 * - Grid assimétrico: 70% conteúdo, 30% sidebar
 * - Cards com sombra sutil e hover effect
 * - Tipografia: Poppins Bold para títulos, Inter Regular para corpo
 * - Cores: Azul vibrante para CTAs, cinza para secundário
 */

interface EditingLink {
  id: string;
  name: string;
  targetUrl: string;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const { links, addLink, deleteLink, updateLink } = useLinks();
  const [, setLocation] = useLocation();
  const [linkName, setLinkName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingLink, setEditingLink] = useState<EditingLink | null>(null);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkName.trim()) {
      toast.error('Por favor, insira um nome para o link');
      return;
    }

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
      addLink(linkName, targetUrl);
      toast.success('Link criado com sucesso!');
      setLinkName('');
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

  const handleEditLink = (link: typeof links[0]) => {
    setEditingLink({
      id: link.id,
      name: link.name,
      targetUrl: link.targetUrl,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingLink) return;

    if (!editingLink.name.trim()) {
      toast.error('Por favor, insira um nome para o link');
      return;
    }

    if (!editingLink.targetUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    if (!editingLink.targetUrl.startsWith('http://') && !editingLink.targetUrl.startsWith('https://')) {
      toast.error('A URL deve começar com http:// ou https://');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      updateLink(editingLink.id, editingLink.name, editingLink.targetUrl);
      toast.success('Link atualizado com sucesso!');
      setEditingLink(null);
    } catch (error) {
      toast.error('Erro ao atualizar link');
    }

    setIsLoading(false);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation('/export')}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Exportar links"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 70% */}
          <div className="lg:col-span-2">
            {/* Add Link Form */}
            <div className="card-minimal mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Criar Novo Link</h2>
              <form onSubmit={handleAddLink} className="space-y-4">
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="Ex: Meu Site, Blog, Portfolio"
                  className="input-minimal w-full"
                  disabled={isLoading}
                />
                <div className="flex gap-3">
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
                    disabled={isLoading || !targetUrl || !linkName}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Criar
                  </button>
                </div>
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
                  {[...links].sort((a, b) => a.name.localeCompare(b.name)).map((link) => (
                    <div key={link.id} className="card-minimal">
                      {editingLink?.id === link.id ? (
                        // Modo de edição
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Nome do Link
                            </label>
                            <input
                              type="text"
                              value={editingLink.name}
                              onChange={(e) => setEditingLink({ ...editingLink, name: e.target.value })}
                              className="input-minimal w-full"
                              disabled={isLoading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              URL de Destino
                            </label>
                            <input
                              type="url"
                              value={editingLink.targetUrl}
                              onChange={(e) => setEditingLink({ ...editingLink, targetUrl: e.target.value })}
                              className="input-minimal w-full"
                              disabled={isLoading}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingLink(null)}
                              className="px-3 py-2 rounded border border-border text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                              disabled={isLoading}
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isLoading}
                            >
                              <Check className="w-4 h-4" />
                              Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Modo de visualização
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-1">{link.name}</h3>
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

                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleCopyLink(link.shortCode)}
                              className="p-2 hover:bg-secondary rounded transition-colors"
                              title="Copiar link"
                            >
                              <Copy className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleEditLink(link)}
                              className="p-2 hover:bg-secondary rounded transition-colors"
                              title="Editar link"
                            >
                              <Edit2 className="w-4 h-4 text-primary" />
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
                      )}
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
                    <li>Insira um nome para o link</li>
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
