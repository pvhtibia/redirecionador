# Link Redirector

Um site estático de redirecionamento de links com proteção por senha e interface de gerenciamento. Perfeito para ser hospedado no GitHub Pages.

## Características

- **Proteção por Senha**: Acesso seguro ao painel de gerenciamento
- **Gerenciamento de Links**: Adicione, visualize e delete links de redirecionamento
- **Links Curtos**: Gere links curtos automaticamente com código de 6 caracteres
- **Rastreamento**: Contabilize quantas vezes cada link foi acessado
- **Armazenamento Local**: Todos os dados são armazenados no localStorage do navegador
- **Design Minimalista**: Interface limpa e profissional
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## Como Usar

### Acesso ao Painel

1. Abra o site
2. Digite a senha: `admin123` (altere isso antes de usar em produção!)
3. Clique em "Entrar"

### Criar um Link

1. No painel de controle, insira a URL de destino completa (ex: `https://exemplo.com/pagina`)
2. Clique em "Criar"
3. O link curto será gerado automaticamente
4. Clique no ícone de cópia para copiar o link para a área de transferência

### Compartilhar Links

Os links gerados têm o formato: `https://seu-dominio.com/r/XXXXXX`

Cada link redireciona automaticamente para a URL de destino que você configurou.

### Deletar Links

Clique no ícone de lixeira ao lado do link que deseja remover.

## Instalação Local

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/link-redirector.git
cd link-redirector

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

## Build para Produção

```bash
# Gerar build estático
pnpm build

# Visualizar build
pnpm preview
```

## Deployment no GitHub Pages

### Opção 1: Usando GitHub Actions

1. Faça push do repositório para GitHub
2. Vá para Settings → Pages
3. Selecione "GitHub Actions" como fonte
4. O workflow será executado automaticamente

### Opção 2: Build Local e Push

```bash
# Fazer build
pnpm build

# Os arquivos estáticos estarão em dist/
# Faça push para a branch gh-pages
git subtree push --prefix dist origin gh-pages
```

### Opção 3: Usar outro serviço de hosting

Como o site é totalmente estático, você pode fazer deploy em:
- Vercel
- Netlify
- Cloudflare Pages
- Qualquer servidor web estático

## Configuração de Segurança

### ⚠️ IMPORTANTE: Altere a Senha

Antes de usar em produção, altere a senha padrão:

1. Abra `client/src/contexts/AuthContext.tsx`
2. Procure pela linha: `const correctPassword = 'admin123';`
3. Altere para sua senha desejada
4. Faça build e deploy novamente

Exemplo:
```typescript
const correctPassword = 'sua-senha-super-secreta-123';
```

### Dados Armazenados

Todos os links e dados de autenticação são armazenados no **localStorage** do navegador. Isso significa:

- Os dados são **locais ao navegador** (não sincronizam entre dispositivos)
- Os dados são **persistentes** (não são perdidos ao fechar o navegador)
- Para limpar os dados, limpe o cache do navegador

## Estrutura do Projeto

```
client/
  src/
    pages/
      Login.tsx          # Tela de login
      Dashboard.tsx      # Painel de gerenciamento
      Redirect.tsx       # Página de redirecionamento
      NotFound.tsx       # Página 404
    contexts/
      AuthContext.tsx    # Gerenciamento de autenticação
      LinksContext.tsx   # Gerenciamento de links
    App.tsx              # Roteamento principal
    index.css            # Estilos globais
```

## Tecnologias Utilizadas

- **React 19**: Framework UI
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Estilos
- **Wouter**: Roteamento
- **Lucide React**: Ícones
- **Sonner**: Notificações
- **Nanoid**: Geração de IDs únicos

## Funcionalidades Futuras

- [ ] Exportar/importar links
- [ ] Customizar domínio base
- [ ] Definir data de expiração para links
- [ ] Análise detalhada de cliques
- [ ] Sincronização entre dispositivos
- [ ] Backup automático

## Licença

MIT

## Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para gerenciar seus links de forma simples e segura.**
