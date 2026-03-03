import { useEffect, useState } from 'react';
import { useLinks } from '@/contexts/LinksContext';
import { useRoute } from 'wouter';
import { Loader2 } from 'lucide-react';

/**
 * Design System: Minimalismo Funcional
 * - Página de redirecionamento limpa e rápida
 * - Spinner minimalista durante o redirecionamento
 * - Fallback para erro 404 se link não existir
 * - Aguarda carregamento dos dados do localStorage
 */

export default function Redirect() {
  const [match, params] = useRoute('/r/:shortCode');
  const { getLink, recordClick, isLoaded } = useLinks();
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');

  useEffect(() => {
    // Aguardar que os dados sejam carregados do localStorage
    if (!isLoaded) {
      return;
    }

    if (!match || !params?.shortCode) {
      setStatus('error');
      return;
    }

    const link = getLink(params.shortCode);

    if (!link) {
      setStatus('error');
      return;
    }

    // Registrar clique
    recordClick(params.shortCode);
    setStatus('redirecting');

    // Redirecionar após 500ms
    const timer = setTimeout(() => {
      window.location.href = link.targetUrl;
    }, 500);

    return () => clearTimeout(timer);
  }, [match, params, getLink, recordClick, isLoaded]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground mb-6">Link não encontrado ou expirado.</p>
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
