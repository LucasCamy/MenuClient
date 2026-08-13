import { describe, expect, it } from 'vitest'
import {
  backgroundPatterns,
  cardLayouts,
  cardStyles,
  defaultMenu,
  formatPrice,
  getThemeColors,
  headerStyles,
  menuTemplates,
  menuThemes,
  type MenuDocument,
} from './menu'

describe('formatPrice', () => {
  it('formats integer cents as Brazilian real', () => {
    expect(formatPrice(1250)).toBe('R$ 12,50')
  })
})

describe('menu styling defaults', () => {
  it('creates a usable visual configuration for a new menu', () => {
    expect(defaultMenu.design).toEqual({
      template: 'classic',
      headerStyle: 'centered',
      cardLayout: 'grid',
      cardStyle: 'soft',
      backgroundPattern: 'clean',
      colors: undefined,
      backgroundImage: undefined,
      backgroundOpacity: 18,
    })
  })

  it('uses custom palette colors when they are configured', () => {
    const menu = { ...defaultMenu, design: { ...defaultMenu.design, colors: { background: '#111111', surface: '#222222', ink: '#eeeeee', accent: '#ff00aa' } } } as MenuDocument
    expect(getThemeColors(menu)).toEqual(menu.design.colors)
  })

  it('offers a substantial, complete set of visual customization options', () => {
    expect(menuThemes).toHaveLength(10)
    expect(menuTemplates).toHaveLength(6)
    expect(backgroundPatterns).toHaveLength(10)
    expect(cardLayouts).toHaveLength(3)
    expect(cardStyles).toHaveLength(6)
    expect(headerStyles).toHaveLength(3)
  })
})
