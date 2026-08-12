export type MenuItem = {
  id: string
  name: string
  description: string
  priceInCents: number
  image?: string
}

export type MenuTheme = 'rose' | 'cocoa' | 'vanilla'

export type MenuDocument = {
  businessName: string
  title: string
  subtitle: string
  contact: string
  theme: MenuTheme
  items: MenuItem[]
}

export const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceInCents / 100)

export const createItem = (): MenuItem => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  priceInCents: 0,
})

export const defaultMenu: MenuDocument = {
  businessName: 'Doçura da Casa',
  title: 'Cardápio de doces',
  subtitle: 'Feitos com carinho para adoçar seus momentos',
  contact: 'Encomendas: (00) 00000-0000',
  theme: 'rose',
  items: [
    { id: 'brigadeiro', name: 'Brigadeiro belga', description: 'Chocolate intenso e granulado nobre', priceInCents: 350 },
    { id: 'brownie', name: 'Brownie cremoso', description: 'Cacau 70% com casquinha crocante', priceInCents: 900 },
    { id: 'cupcake', name: 'Cupcake de baunilha', description: 'Recheio de frutas vermelhas', priceInCents: 1200 },
  ],
}
