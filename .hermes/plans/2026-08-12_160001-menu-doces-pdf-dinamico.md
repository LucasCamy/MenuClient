# Gerador de Cardápio de Doces em PDF — Plano de Implementação

> **Para Hermes:** use a habilidade `subagent-driven-development` para executar este plano tarefa por tarefa.

**Objetivo:** construir uma aplicação web simples e elegante em que a pessoa cadastra itens de doces (nome, preço, descrição/opcional, foto), configura título, subtítulo, marca e fundo, visualiza o cardápio ao vivo e exporta um PDF pronto para impressão ou compartilhamento.

**Arquitetura:** uma SPA responsiva com dois painéis: o editor de conteúdo/configuração e uma prévia que usa o mesmo componente do PDF. Os dados ficam no navegador no MVP (rascunho persistido em `localStorage`), imagens são compactadas localmente, e a exportação converte o layout de impressão A4 em PDF no cliente — sem depender de servidor.

**Stack sugerida:** React + TypeScript + Vite, Tailwind CSS, React Hook Form + Zod, `@react-pdf/renderer` para PDF A4, IndexedDB/localForage para imagens e rascunhos, Vitest + Testing Library e Playwright para o fluxo completo.

---

## Contexto e premissas

- O diretório de trabalho atual (`F:\Menu`) está vazio; este plano assume um projeto novo.
- O MVP terá **um cardápio por vez**, salvo localmente. Login, pagamento, múltiplos usuários e hospedagem pública ficam fora do escopo inicial.
- A interface será em português (pt-BR), com preços em real brasileiro (`R$`).
- A versão inicial deve gerar PDF A4 com **múltiplas páginas automaticamente**. A pessoa poderá cadastrar quantos doces precisar; o sistema distribui os itens em páginas completas sem cortar cards nem reduzir a legibilidade para forçar tudo em uma página.
- Fotos serão opcionais por item, mas o design deverá continuar bonito sem elas. A usuária também poderá optar por uma imagem de fundo ou fundo com cor/gradiente.
- O produto inicial é somente para criação e download do PDF. QR Code, link público, WhatsApp e pedidos online permanecem explicitamente fora do MVP.

## Experiência e direção visual

A estética deve ser de confeitaria premium e acolhedora — delicada, não infantil:

- **Paleta base:** creme/baunilha, chocolate/cacau, caramelo, rosa-framboesa e dourado suave; contraste sempre legível.
- **Tipografia:** título com fonte serifada expressiva (ex.: Playfair Display ou Cormorant Garamond) e informações com uma sans-serif limpa (ex.: DM Sans/Inter).
- **Estrutura A4:** cabeçalho com marca/título, subtítulo opcional, detalhe ornamental discreto, grade de produtos e rodapé com contato/encomendas.
- **Itens:** foto com borda arredondada, nome, descrição opcional e preço muito claro. Sem foto, usar card elegante com ilustração/ícone abstrato de doce ou campo de cor do tema.
- **Temas iniciais:** `Confeitaria Clássica`, `Rosé Delicado`, `Chocolate Artesanal` e `Colorido Moderno`; cada um ajusta cores, molduras e ornamentação. A personalização manual permanece disponível.
- **Acessibilidade:** contraste validado, labels nos campos, alternativa textual nas imagens e navegação por teclado.

---

## Modelo de dados proposto

```ts
export type MenuItem = {
  id: string;
  title: string;
  description?: string;
  price: number;              // centavos, para evitar erros de ponto flutuante
  image?: StoredImage;
  featured?: boolean;
  position: number;
};

export type MenuTheme = {
  presetId: 'classic' | 'rose' | 'chocolate' | 'modern';
  backgroundColor: string;
  foregroundColor: string;
  accentColor: string;
  cardColor: string;
  titleFont: 'playfair' | 'cormorant';
  bodyFont: 'dm-sans' | 'inter';
  backgroundImage?: StoredImage;
  backgroundOpacity: number;
};

export type MenuDocument = {
  id: string;
  title: string;
  subtitle?: string;
  businessName?: string;
  contactLine?: string;
  items: MenuItem[];
  theme: MenuTheme;
  updatedAt: string;
};
```

---

## Plano passo a passo

### Tarefa 1: Inicializar o projeto e os padrões de qualidade

**Objetivo:** criar a base executável do aplicativo com tipagem, lint, testes unitários e testes de navegador.

**Arquivos:**
- Criar: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`
- Criar: `src/styles/globals.css`
- Criar: `vitest.config.ts`, `playwright.config.ts`
- Criar: `src/test/setup.ts`, `e2e/menu.spec.ts`

**Passos:**
1. Criar um projeto Vite React TypeScript no diretório atual.
2. Adicionar Tailwind, React Hook Form, Zod, `@react-pdf/renderer`, localForage, Vitest, Testing Library e Playwright.
3. Configurar aliases (`@/`), ESLint e scripts: `dev`, `build`, `lint`, `test`, `test:watch`, `test:e2e`.
4. Criar o shell mínimo da aplicação e um teste que verifica a renderização do título da página.
5. Executar `npm run lint`, `npm run test -- --run` e `npm run build`; todos devem terminar com sucesso.

**Critério de aceite:** o projeto abre com `npm run dev`, e os comandos de qualidade acima passam sem erros.

---

### Tarefa 2: Definir tokens visuais e layout responsivo do estúdio

**Objetivo:** criar a base visual sofisticada e utilizável em desktop e celular.

**Arquivos:**
- Criar: `src/styles/tokens.css`
- Criar: `src/components/layout/AppShell.tsx`
- Criar: `src/components/layout/EditorPanel.tsx`
- Criar: `src/components/layout/PreviewPanel.tsx`
- Criar: `src/components/ui/SectionCard.tsx`
- Modificar: `src/App.tsx`, `src/styles/globals.css`
- Testar: `src/components/layout/AppShell.test.tsx`

**Passos:**
1. Criar tokens CSS para cores de confeitaria, espaçamentos, sombras, bordas, tamanhos tipográficos e foco acessível.
2. Carregar as duas famílias tipográficas escolhidas com fallback local seguro.
3. Montar a página com topo (nome do produto, indicador “salvo”), painel editor à esquerda e prévia à direita.
4. Em telas pequenas, alternar os painéis em abas “Editar” e “Prévia”, mantendo o botão “Gerar PDF” acessível.
5. Escrever testes para o shell, títulos de abas e navegação por teclado.

**Critério de aceite:** o layout não quebra entre 320 px e desktop amplo, e a prévia mantém proporção A4.

---

### Tarefa 3: Criar estado, validação e persistência do cardápio

**Objetivo:** permitir criar, editar e restaurar automaticamente um cardápio válido.

**Arquivos:**
- Criar: `src/domain/menu.ts`
- Criar: `src/domain/menuSchema.ts`
- Criar: `src/lib/currency.ts`
- Criar: `src/lib/menuStorage.ts`
- Criar: `src/hooks/useMenuDocument.ts`
- Criar: `src/fixtures/defaultMenu.ts`
- Testar: `src/domain/menuSchema.test.ts`, `src/lib/currency.test.ts`, `src/lib/menuStorage.test.ts`

**Passos:**
1. Implementar os tipos e o schema Zod descritos acima.
2. Definir um rascunho inicial visualmente pronto, com exemplos de brigadeiro, brownie e cupcake para que a primeira prévia não esteja vazia.
3. Criar formatador de centavos para `R$ 0,00` e parser seguro de entrada pt-BR.
4. Salvar automaticamente alterações com debounce; ao abrir a aplicação, restaurar o último rascunho.
5. Se houver dados antigos/corrompidos, carregar o rascunho padrão sem apagar silenciosamente a origem e exibir uma mensagem compreensível.
6. Cobrir validação de título, preço, descrição opcional, ordenação, moeda e restauração em testes.

**Critério de aceite:** ao recarregar a página, título, tema e itens cadastrados continuam presentes; valores inválidos não entram na prévia/PDF.

---

### Tarefa 4: Implementar formulário de informações gerais e temas

**Objetivo:** possibilitar personalização de cabeçalho e aparência sem exigir conhecimento de design.

**Arquivos:**
- Criar: `src/components/editor/MenuDetailsForm.tsx`
- Criar: `src/components/editor/ThemePicker.tsx`
- Criar: `src/components/editor/ColorField.tsx`
- Criar: `src/fixtures/themes.ts`
- Testar: `src/components/editor/MenuDetailsForm.test.tsx`, `src/components/editor/ThemePicker.test.tsx`

**Passos:**
1. Adicionar campos: nome do negócio, título, subtítulo (com opção de ocultar), linha de contato/encomendas.
2. Mostrar contador e feedback de comprimento no título/subtítulo para preservar a composição A4.
3. Criar cartões de seleção para os quatro temas iniciais, cada um com miniatura de cores e fontes.
4. Permitir ajuste fino de cor de fundo, texto, destaque e cards após escolher um tema.
5. Incluir botão “Restaurar tema” que retorna ao preset escolhido e confirmação somente quando houver alterações manuais.
6. Validar visualmente e por testes a atualização imediata da prévia.

**Critério de aceite:** mudanças no formulário aparecem na prévia sem recarregar e um tema pode ser escolhido/restaurado de forma previsível.

---

### Tarefa 5: Implementar cadastro e gerenciamento de doces

**Objetivo:** permitir adicionar, editar, remover, destacar e ordenar produtos de forma simples.

**Arquivos:**
- Criar: `src/components/editor/MenuItemList.tsx`
- Criar: `src/components/editor/MenuItemForm.tsx`
- Criar: `src/components/editor/MenuItemRow.tsx`
- Criar: `src/components/editor/EmptyItemsState.tsx`
- Criar: `src/lib/menuItems.ts`
- Testar: `src/components/editor/MenuItemForm.test.tsx`, `src/lib/menuItems.test.ts`

**Passos:**
1. Criar uma lista de itens com botão “Adicionar doce”.
2. Implementar formulário com nome obrigatório, preço obrigatório, descrição opcional, foto opcional e alternância “Destaque”.
3. Mostrar erros próximos aos campos: nome vazio, preço inválido/negativo e foto em formato não aceito.
4. Implementar edição por item, exclusão com confirmação e duplicação para agilizar cadastros semelhantes.
5. Adicionar controles de mover para cima/baixo inicialmente; usar drag-and-drop apenas se os testes de acessibilidade e mobilidade permanecerem bons.
6. Exibir estado vazio elegante e chamada clara para criar o primeiro doce.

**Critério de aceite:** a pessoa cadastra e organiza itens sem perder dados; cada atualização é refletida na prévia e persistida.

---

### Tarefa 6: Tratar upload e armazenamento local de imagens

**Objetivo:** aceitar fotos bonitas no menu sem tornar o PDF pesado ou instável.

**Arquivos:**
- Criar: `src/components/editor/ImageUploader.tsx`
- Criar: `src/lib/imageProcessing.ts`
- Criar: `src/lib/imageStorage.ts`
- Testar: `src/lib/imageProcessing.test.ts`, `src/components/editor/ImageUploader.test.tsx`

**Passos:**
1. Aceitar JPEG, PNG e WebP via seletor e arrastar-e-soltar.
2. Corrigir orientação EXIF, centralizar recorte quadrado/4:3 e gerar uma versão WebP otimizada, limitada por dimensão e tamanho.
3. Guardar imagens no IndexedDB e persistir somente a referência/miniatura necessária no documento.
4. Permitir remover ou substituir a foto de cada doce e definir uma imagem de fundo do menu.
5. Exibir prévia de carregamento, erro amigável para arquivo inválido/grande e texto alternativo editável (padrão: nome do doce).
6. Testar formatos aceitos, rejeitados, remoção e processamento básico com mocks de canvas/arquivo.

**Critério de aceite:** imagens reaparecem após recarregar, mantêm boa qualidade visual e o PDF final continua leve e gerável.

---

### Tarefa 7: Construir a prévia A4 e os templates de cardápio

**Objetivo:** transformar os dados em um cardápio visualmente caprichado e pronto para impressão.

**Arquivos:**
- Criar: `src/components/preview/MenuCanvas.tsx`
- Criar: `src/components/preview/MenuHeader.tsx`
- Criar: `src/components/preview/MenuGrid.tsx`
- Criar: `src/components/preview/MenuCard.tsx`
- Criar: `src/components/preview/MenuFooter.tsx`
- Criar: `src/components/preview/BackgroundLayer.tsx`
- Criar: `src/lib/menuLayout.ts`
- Testar: `src/components/preview/MenuCanvas.test.tsx`, `src/lib/menuLayout.test.ts`

**Passos:**
1. Criar o canvas em proporção A4 com área segura de impressão, fundo com cor/gradiente/imagem e camada de legibilidade.
2. Implementar cabeçalho com nome de negócio, título grande, subtítulo opcional e ornamento leve baseado no tema.
3. Criar cards de doce em grade adaptativa por página: uma grade mais arejada para até 6 itens e uma grade compacta para páginas com mais itens.
4. Implementar paginação determinística: calcular os itens que cabem respeitando cabeçalho/rodapé na primeira página e área de conteúdo nas demais; iniciar uma nova página antes de qualquer card ficar parcialmente visível.
5. Repetir um cabeçalho compacto (marca/título) nas páginas seguintes e adicionar numeração discreta (`Página X de Y`), preservando a identidade visual.
6. Garantir que preço e nome não truncam silenciosamente; aplicar quebra de texto e altura mínima de card. Se um único item não couber pelas próprias dimensões, exibir aviso de conteúdo e não gerar um PDF visualmente corrompido.
7. Destacar produtos marcados com selo discreto (“Especial”, por exemplo) sem desviar do conteúdo principal.
8. Renderizar rodapé somente se houver contato/encomendas.
9. Cobrir os cenários: sem foto, título longo, sem subtítulo, item destacado, fundo personalizado, tema de alto contraste e lista extensa distribuída em mais de uma página.

**Critério de aceite:** a prévia tem aparência consistente, legível e premium com e sem imagens; listas extensas são divididas automaticamente em páginas A4 sem cortes ou perda de itens.

---

### Tarefa 8: Gerar e baixar PDF A4 fiel à prévia

**Objetivo:** criar um PDF real, com boa qualidade de impressão, a partir do mesmo modelo visual do menu.

**Arquivos:**
- Criar: `src/pdf/MenuPdfDocument.tsx`
- Criar: `src/pdf/pdfFonts.ts`
- Criar: `src/hooks/usePdfExport.ts`
- Criar: `src/components/editor/ExportButton.tsx`
- Testar: `src/pdf/MenuPdfDocument.test.tsx`, `src/hooks/usePdfExport.test.tsx`

**Passos:**
1. Registrar fontes compatíveis/licenciadas para uso no PDF e incluir fallbacks.
2. Implementar documento `@react-pdf/renderer` com páginas A4, margens seguras, cores do tema, imagens e layout equivalentes à prévia. Usar paginação automática para listas extensas, sem depender de um teto fixo de itens.
3. Repetir cabeçalho compacto e numeração no PDF quando houver mais de uma página; garantir que a última página também tenha acabamento visual completo.
4. Criar botão “Gerar PDF” com estados: pronto, preparando imagens/fontes, gerando, sucesso e falha recuperável.
5. Baixar com nome sanitizado, por exemplo: `menu-doces-nome-da-marca.pdf`.
6. Implementar tratamento para imagens indisponíveis: gerar o item sem foto e informar no aviso, em vez de bloquear toda a exportação.
7. Testar criação do blob, nome do arquivo, paginação e estados de erro; fazer uma validação manual abrindo um arquivo longo em leitor PDF.

**Critério de aceite:** o PDF baixa, abre sem erro, usa quantas páginas A4 forem necessárias, contém todos os dados/fotos corretos e mantém hierarquia visual próxima da prévia.

---

### Tarefa 9: Polimento, acessibilidade e cenários de confiança

**Objetivo:** tornar o sistema agradável, claro e seguro para uso cotidiano.

**Arquivos:**
- Criar: `src/components/ui/Toast.tsx`
- Criar: `src/components/editor/ResetMenuButton.tsx`
- Criar: `src/lib/a11y.ts`
- Modificar: componentes de editor, prévia e exportação
- Criar: `e2e/create-menu-and-export.spec.ts`

**Passos:**
1. Adicionar feedback não intrusivo de “salvo automaticamente”, erros e conclusão da geração do PDF.
2. Incluir reset do cardápio com confirmação explícita e uma opção para carregar dados de exemplo novamente.
3. Revisar labels, foco, contraste, mensagens de validação e ordem de tabulação usando axe/playwright.
4. Adicionar `aria-live` para status de upload, salvamento e exportação.
5. Testar o fluxo de ponta a ponta: editar título, adicionar doce com foto, escolher tema, recarregar e gerar PDF.
6. Fazer revisão visual em desktop e celular; corrigir quebras de layout antes da entrega.

**Critério de aceite:** o fluxo completo funciona sem conta, é compreensível por teclado/leitor de tela e passa nos testes automatizados.

---

### Tarefa 10: Documentar execução, limites e evolução do produto

**Objetivo:** deixar o projeto utilizável por outra pessoa e explicitar o que o MVP cobre.

**Arquivos:**
- Criar: `README.md`
- Criar: `.env.example` (somente se uma futura integração exigir variáveis)
- Criar: `docs/design-decisions.md`

**Passos:**
1. Documentar pré-requisitos, instalação, scripts, como usar, como exportar PDF e como redefinir rascunho local.
2. Listar limites do MVP: armazenamento por navegador, exportação local e ausência de sincronização/conta — não existe limite artificial de páginas; o PDF cresce conforme a quantidade de itens.
3. Documentar decisões de fontes, compactação de imagens, paginação e estratégia de fallback do PDF.
4. Registrar backlog priorizado: QR code, links de WhatsApp, cardápio público por link, pedidos online, templates sazonais, exportar/importar JSON e conta/sincronização.
5. Rodar a suíte final: `npm run lint && npm run test -- --run && npm run build && npm run test:e2e`.

**Critério de aceite:** uma pessoa nova consegue rodar o projeto e entender o escopo sem depender de explicação oral.

---

## Arquivos principais ao final

```text
src/
  components/
    editor/        # formulário, itens, imagens, temas, exportação
    layout/        # estrutura responsiva do estúdio
    preview/       # prévia A4 compartilhada conceitualmente com o PDF
    ui/            # componentes reutilizáveis e feedback
  domain/          # tipos e schema de validação
  fixtures/        # temas e cardápio inicial
  hooks/           # estado do documento e exportação
  lib/             # moeda, imagens, storage, cálculos de layout
  pdf/             # documento A4 e fontes para exportação
  styles/          # tokens e estilos globais
  App.tsx
```

## Estratégia de testes e validação

1. **Unitários (Vitest):** moeda, schema, ordenação, cálculo de layout, persistência e processamento de imagens.
2. **Componentes (Testing Library):** erros de formulário, escolha de tema, lista de doces, atualização da prévia e estados de exportação.
3. **E2E (Playwright):** criar/editar menu, carregar foto, restaurar rascunho, gerar e verificar o download de PDF.
4. **Acessibilidade:** `axe` no editor e na prévia, além de teste manual de teclado.
5. **Validação visual manual:** abrir o PDF gerado em leitor comum e conferir impressão em escala 100%, principalmente contraste, cortes e imagens.
6. **Gate final:** `npm run lint && npm run test -- --run && npm run build && npm run test:e2e`.

## Riscos e decisões

| Risco | Mitigação |
|---|---|
| Layout HTML e PDF não ficarem idênticos | Manter o mesmo modelo de dados, tokens e regras de grade; testar combinações representativas e priorizar fidelidade da hierarquia/medidas. |
| Fotos muito grandes travarem o navegador ou o PDF | Redimensionar/otimizar no upload, impor limite e usar IndexedDB. |
| Conteúdo demais em uma página | Implementar paginação automática A4, mantendo cards inteiros; repetir cabeçalho compacto e numeração nas páginas seguintes. |
| Fontes externas indisponíveis no PDF | Registrar fontes no bundle ou usar fallback seguro, validando a exportação offline. |
| Armazenamento local ser apagado | Explicitar a limitação no MVP; próximo passo pode incluir exportar/importar JSON e sincronização. |

## Escopo fechado do primeiro MVP

- **Incluído:** criar e editar livremente o cardápio; itens extensos; fotos; fundos/temas; prévia; download de PDF A4 com múltiplas páginas automáticas.
- **Fora do escopo por enquanto:** QR code, envio ou link de WhatsApp, pedidos, links públicos, login e sincronização em nuvem. Esses recursos serão avaliados depois conforme a necessidade da cliente.

## Perguntas para decidir antes ou durante a implementação

1. O cardápio será apenas para impressão/WhatsApp ou também precisa de versão pública com link/QR code?
2. Você deseja incluir campos de contato, Instagram e WhatsApp já no primeiro lançamento?
3. O menu deve lidar apenas com doces individuais ou também com caixas, kits e tamanhos/sabores?
4. Há uma identidade visual existente (logo, cores e fontes) para usar, ou os temas prontos serão o ponto de partida?
5. Você prefere que o primeiro MVP suporte mais de uma página desde o início, ou priorizamos uma página perfeita e expandimos depois?

---

## Entrega do MVP

Ao fim, a usuária poderá abrir o site, preencher título/subtítulo, incluir e ordenar doces com preços e fotos, escolher/ajustar um fundo e estilo, conferir o resultado em tempo real e baixar um **PDF A4 elegante e pronto para compartilhar** — sem criar conta e sem depender de servidor.
