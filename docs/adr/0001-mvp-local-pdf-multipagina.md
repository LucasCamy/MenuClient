# ADR 0001 — Cardápio local com exportação de PDF A4 multipágina

- **Status:** Aceito
- **Data:** 2026-08-12
- **Decisores:** Produto e desenvolvimento

## Contexto

O produto precisa permitir que uma confeiteira crie um cardápio extenso de doces de forma visual, cadastre título, subtítulo opcional, preços, descrições, fotos e identidade visual, e faça download de um PDF caprichado.

A primeira versão deve ter baixo atrito: a cliente precisa abrir, editar e baixar o arquivo sem depender de cadastro, servidor, conta ou integração externa. Como o catálogo pode ser longo, limitar o resultado a uma página A4 causaria cortes, letras pequenas ou perda de legibilidade.

## Decisão

Construiremos um aplicativo web cliente (React + TypeScript) que:

1. Mantém o rascunho do cardápio no navegador, com textos/configurações em `localStorage` e imagens em IndexedDB.
2. Oferece temas de confeitaria e ajustes de fundo, cores e fontes, com prévia em formato A4.
3. Gera e baixa um PDF A4 com **quantas páginas forem necessárias**.
4. Pagina os itens mantendo cada card inteiro; páginas posteriores recebem cabeçalho compacto e numeração discreta.
5. Funciona sem backend, login ou sincronização em nuvem no MVP.

A exportação usará `@react-pdf/renderer`. A prévia e o PDF compartilharão modelo de dados, tokens visuais e regras de layout, mas cada meio poderá ter seu componente de renderização próprio para preservar a confiabilidade do PDF.

## Consequências

### Positivas

- A cliente pode começar imediatamente, sem criar conta.
- Não há custo ou complexidade de infraestrutura no primeiro lançamento.
- Catálogos grandes permanecem legíveis e completos.
- O PDF é gerado localmente e pode ser compartilhado por qualquer canal.
- A base permite adicionar QR Code, WhatsApp, link público e sincronização posteriormente.

### Negativas e limites aceitos

- Os dados podem ser perdidos se o navegador limpar o armazenamento local.
- O rascunho não aparece automaticamente em outro dispositivo.
- Prévia HTML e PDF exigem testes visuais para evitar divergência de composição.
- Imagens precisam ser otimizadas antes de entrar no documento para não degradar a exportação.

## Alternativas consideradas

### Uma única página A4

Rejeitada: não suporta cardápios extensos sem comprometer legibilidade ou cortar conteúdo.

### Backend, login e armazenamento na nuvem desde o início

Rejeitada para o MVP: aumenta custo, prazo, suporte e barreiras de uso antes de validar o fluxo principal de criação e download.

### Gerar PDF em um servidor

Rejeitada para o MVP: exige infraestrutura e envio de fotos/dados. A geração no cliente atende ao requisito sem esse acoplamento.

### Imprimir diretamente a tela HTML

Rejeitada como caminho principal: layouts e fundos podem variar conforme navegador/impressora. Um documento PDF dedicado fornece resultado mais previsível.

## Fora do escopo do MVP

- QR Code;
- links e catálogo público;
- pedidos por WhatsApp;
- pagamentos;
- login, múltiplos usuários ou sincronização em nuvem.

Essas opções serão reavaliadas após uso real pela cliente.

## Critérios de sucesso

- É possível criar e editar livremente um cardápio com fotos, textos e preços.
- O rascunho é recuperado após atualizar a página no mesmo navegador.
- O PDF baixado abre corretamente, é A4 e contém todos os itens em páginas necessárias, sem cards parcialmente cortados.
- O fluxo funciona sem serviço externo obrigatório.
