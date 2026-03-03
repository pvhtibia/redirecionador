import { useLocation } from 'wouter';

/**
 * Design System: Minimalismo Funcional
 * - Página 404 clara e direta
 * - Link para voltar ao início
 */

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Página não encontrada.
        </p>
        <button
          onClick={() => setLocation('/')}
          className="btn-primary inline-block"
        >
          Voltar para Início
        </button>
      </div>
    </div>
  );
}
