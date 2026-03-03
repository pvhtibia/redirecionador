import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Design System: Minimalismo Funcional
 * - Tipografia: Poppins Bold para título, Inter Regular para corpo
 * - Cores: Azul vibrante (#2563EB) como accent, branco/cinza para fundo
 * - Layout: Centralizado, espaçamento generoso
 * - Interações: Transições suaves, feedback imediato
 */

export default function Login() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 300));

    if (login(password)) {
      toast.success('Login realizado com sucesso!');
      setLocation('/dashboard');
    } else {
      toast.error('Senha incorreta. Tente novamente.');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-lg p-3">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Link Redirector</h1>
          <p className="text-muted-foreground">Acesso seguro ao gerenciador de links</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card-minimal">
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Senha de Acesso
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="input-minimal w-full"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2">
              Digite sua senha para acessar o painel.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Este é um gerenciador privado de links.</p>
          <p>Altere a senha no código antes de usar em produção.</p>
        </div>
      </div>
    </div>
  );
}
