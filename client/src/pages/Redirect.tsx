import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Loader2 } from 'lucide-react';

/**
 * Design System: Minimalismo Funcional
 * - Página de redirecionamento limpa e rápida
 * - Busca links diretamente do localStorage
 */

const STORAGE_KEY = 'link-redirector-links';

interface RedirectLink {
  id: string;
  shortCode: string;
  name: string;
  targetUrl: string;
  createdAt: string;
  clicks: number;
}

export default function Redirect() {
  const [match, params] = useRoute('/r/:shortCode');
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');
  const [availableLinks, setAvailableLinks] = useState<string>('');

  useEffect(() => {
    if (!match || !params?.shortCode) {
      setStatus('error');
      return;
    }

    const shortCode = params.shortCode as string;

    // Carregar links do localStorage
    let links: RedirectLink[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        links = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    }

    console.log('Buscando link:', shortCode);
    console.log('Links disponíveis:', links.length);

    // Buscar o link
    const link = links.find(l => l.shortCode === shortCode);

    if (!link) {
      setStatus('error');
      setAvailableLinks(links.map(l => l.shortCode).join(', ') || 'nenhum');
      return;
    }

    // Registrar clique
    const updatedLinks = links.map(l =>
      l.shortCode === shortCode
        ? { ...l, clicks: l.clicks + 1 }
        : l
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
    } catch (error) {
      console.error('Erro ao atualizar cliques:', error);
    }

    setStatus('redirecting');

    // Redirecionar após 300ms
    const timer = setTimeout(() => {
      window.location.href = link.targetUrl;
    }, 300);

    return () => clearTimeout(timer);
  }, [match, params]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground mb-6">Link não encontrado ou expirado.</p>
          {availableLinks && (
            <p className="text-xs text-muted-foreground mb-6 bg-secondary p-3 rounded">
              Links disponíveis: {availableLinks}
            </p>
          )}
          <a
            href="/"
            className="btn-primary inline-block"
          >
            Voltar para Início
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
