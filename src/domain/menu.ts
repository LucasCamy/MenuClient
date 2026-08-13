export type MenuItem = {
  id: string
  name: string
  description: string
  priceInCents: number
  image?: string
}

export type MenuTheme = 'rose' | 'cocoa' | 'vanilla' | 'berry' | 'sage' | 'lavender' | 'citrus' | 'midnight' | 'ocean' | 'terracotta'
export type MenuTemplate = 'classic' | 'editorial' | 'bold' | 'romantic' | 'modern' | 'artisan'
export type HeaderStyle = 'centered' | 'left' | 'banner'
export type CardLayout = 'grid' | 'list' | 'compact'
export type CardStyle = 'soft' | 'outlined' | 'minimal' | 'shadow' | 'label' | 'split'
export type BackgroundPattern = 'clean' | 'confetti' | 'waves' | 'botanical' | 'checker' | 'sprinkles' | 'ribbons' | 'scallop' | 'dots' | 'marble'

export type MenuColors = {
  background: string
  surface: string
  ink: string
  accent: string
}

export type DesignOption<T extends string> = {
  id: T
  label: string
  description: string
}

export type MenuDesign = {
  template: MenuTemplate
  headerStyle: HeaderStyle
  cardLayout: CardLayout
  cardStyle: CardStyle
  backgroundPattern: BackgroundPattern
  colors?: MenuColors
  backgroundImage?: string
  backgroundOpacity: number
}

export type MenuDocument = {
  businessName: string
  title: string
  subtitle: string
  contact: string
  theme: MenuTheme
  design: MenuDesign
  items: MenuItem[]
}

export const menuThemes: Array<DesignOption<MenuTheme> & { colors: MenuColors }> = [
  { id: 'rose', label: 'Rosé delicado', description: 'Romântico e suave', colors: { background: '#fdf5f2', surface: '#fffaf8', ink: '#542f34', accent: '#b86676' } },
  { id: 'cocoa', label: 'Chocolate artesanal', description: 'Quente e sofisticado', colors: { background: '#f6efe8', surface: '#fffaf5', ink: '#45251d', accent: '#a7603f' } },
  { id: 'vanilla', label: 'Baunilha clássica', description: 'Claro e elegante', colors: { background: '#fcf8ed', surface: '#fffdf7', ink: '#53432c', accent: '#ac8b47' } },
  { id: 'berry', label: 'Frutas vermelhas', description: 'Vibrante e doce', colors: { background: '#f8f0f3', surface: '#fffafd', ink: '#4a283b', accent: '#a33f69' } },
  { id: 'sage', label: 'Jardim suave', description: 'Natural e leve', colors: { background: '#f1f5ed', surface: '#fbfdf8', ink: '#304237', accent: '#668b70' } },
  { id: 'lavender', label: 'Lavanda', description: 'Calmo e refinado', colors: { background: '#f4f1fa', surface: '#fdfbff', ink: '#40364f', accent: '#8571aa' } },
  { id: 'citrus', label: 'Cítrico solar', description: 'Alegre e fresco', colors: { background: '#fff8e8', surface: '#fffdf6', ink: '#554322', accent: '#d58f2e' } },
  { id: 'midnight', label: 'Noite doce', description: 'Escuro e luxuoso', colors: { background: '#29232f', surface: '#382f40', ink: '#fff7ed', accent: '#f0b27a' } },
  { id: 'ocean', label: 'Azul confeitaria', description: 'Fresco e sereno', colors: { background: '#eef7fa', surface: '#fbfeff', ink: '#25434b', accent: '#4e94a7' } },
  { id: 'terracotta', label: 'Terracota', description: 'Rústico e acolhedor', colors: { background: '#fbf1e9', surface: '#fffaf6', ink: '#513128', accent: '#ba7158' } },
]

export const menuTemplates: Array<DesignOption<MenuTemplate>> = [
  { id: 'classic', label: 'Clássico delicado', description: 'Serifado, delicado e acolhedor' },
  { id: 'editorial', label: 'Editorial', description: 'Limpo, sofisticado e arejado' },
  { id: 'bold', label: 'Impacto doce', description: 'Título marcante e cards fortes' },
  { id: 'romantic', label: 'Romântico', description: 'Curvas, detalhes e leveza' },
  { id: 'modern', label: 'Contemporâneo', description: 'Geometria e contraste' },
  { id: 'artisan', label: 'Artesanal', description: 'Orgânico e feito à mão' },
]

export const backgroundPatterns: Array<DesignOption<BackgroundPattern>> = [
  { id: 'clean', label: 'Clean', description: 'Discreto e sem textura' },
  { id: 'confetti', label: 'Confetes', description: 'Pontos festivos suaves' },
  { id: 'waves', label: 'Ondas', description: 'Curvas delicadas' },
  { id: 'botanical', label: 'Botânico', description: 'Ornamentos florais' },
  { id: 'checker', label: 'Quadriculado', description: 'Toque de confeitaria' },
  { id: 'sprinkles', label: 'Granulado', description: 'Textura divertida' },
  { id: 'ribbons', label: 'Fitas', description: 'Linhas em movimento' },
  { id: 'scallop', label: 'Escamas', description: 'Arcos elegantes' },
  { id: 'dots', label: 'Poá', description: 'Bolinhas clássicas' },
  { id: 'marble', label: 'Mármore', description: 'Textura sofisticada' },
]

export const cardLayouts: Array<DesignOption<CardLayout>> = [
  { id: 'grid', label: '2 por linha', description: 'Equilibrado e versátil' },
  { id: 'list', label: '1 por linha', description: 'Espaçoso e detalhado' },
  { id: 'compact', label: 'Compacto', description: 'Mais itens por página' },
]

export const cardStyles: Array<DesignOption<CardStyle>> = [
  { id: 'soft', label: 'Suave', description: 'Bordas arredondadas' },
  { id: 'outlined', label: 'Contorno', description: 'Moldura definida' },
  { id: 'minimal', label: 'Minimalista', description: 'Apenas o essencial' },
  { id: 'shadow', label: 'Elevado', description: 'Sombra delicada' },
  { id: 'label', label: 'Etiqueta', description: 'Preço em destaque' },
  { id: 'split', label: 'Dividido', description: 'Foto e dados lado a lado' },
]

export const headerStyles: Array<DesignOption<HeaderStyle>> = [
  { id: 'centered', label: 'Centralizado', description: 'Clássico e equilibrado' },
  { id: 'left', label: 'Alinhado à esquerda', description: 'Editorial e moderno' },
  { id: 'banner', label: 'Faixa de destaque', description: 'Título com impacto' },
]

export const themeColors = Object.fromEntries(menuThemes.map((theme) => [theme.id, theme.colors])) as Record<MenuTheme, MenuColors>
export const getThemeColors = (menu: MenuDocument): MenuColors => menu.design.colors ?? themeColors[menu.theme]
export const formatPrice = (priceInCents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceInCents / 100)

export const createItem = (): MenuItem => ({ id: crypto.randomUUID(), name: '', description: '', priceInCents: 0 })

export const defaultMenu: MenuDocument = {
  businessName: 'Doçura da Casa',
  title: 'Cardápio de doces',
  subtitle: 'Feitos com carinho para adoçar seus momentos',
  contact: 'Encomendas: (00) 00000-0000',
  theme: 'rose',
  design: { template: 'classic', headerStyle: 'centered', cardLayout: 'grid', cardStyle: 'soft', backgroundPattern: 'clean', colors: undefined, backgroundImage: undefined, backgroundOpacity: 18 },
  items: [
    { id: 'brigadeiro', name: 'Brigadeiro belga', description: 'Chocolate intenso e granulado nobre', priceInCents: 350 },
    { id: 'brownie', name: 'Brownie cremoso', description: 'Cacau 70% com casquinha crocante', priceInCents: 900 },
    { id: 'cupcake', name: 'Cupcake de baunilha', description: 'Recheio de frutas vermelhas', priceInCents: 1200 },
  ],
}

export const normalizeMenu = (draft: Partial<MenuDocument>): MenuDocument => ({ ...defaultMenu, ...draft, design: { ...defaultMenu.design, ...draft.design }, items: draft.items ?? defaultMenu.items })
