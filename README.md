# Doce Menu

Aplicação web para criar cardápios de doces personalizados e baixar um PDF A4 com múltiplas páginas quando necessário.

## Requisitos

- Node.js 24+ (ou versão LTS atual)
- npm 11+

## Como iniciar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite — normalmente `http://localhost:5173`.

## Como usar

1. Preencha nome da marca, título, subtítulo e contato.
2. Escolha um tema.
3. Edite os doces, preços, descrições e fotos.
4. Clique em **Baixar PDF** para gerar o arquivo.

O rascunho é salvo automaticamente no navegador. Nesta primeira versão, ele não é sincronizado entre dispositivos.

## Scripts

```bash
npm run dev        # inicia o ambiente de desenvolvimento
npm run build      # gera a versão de produção em dist/
npm run test       # executa os testes
npm run lint       # verifica padrões de código
```

## Escopo do MVP

Inclui criação do cardápio, temas, fotos, prévia e PDF A4 multipágina. QR Code, WhatsApp, pedidos, links públicos, login e sincronização em nuvem serão avaliados em uma próxima etapa.

A decisão arquitetural está em [`docs/adr/0001-mvp-local-pdf-multipagina.md`](docs/adr/0001-mvp-local-pdf-multipagina.md).
