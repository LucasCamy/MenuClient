import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('shows the menu editor and the live preview', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Crie seu cardápio' })).toBeInTheDocument()
    expect(screen.getByText('Prévia ao vivo')).toBeInTheDocument()
  })

  it('keeps the live preview in a dedicated sticky viewport panel on desktop', () => {
    render(<App />)

    expect(screen.getByLabelText('Prévia do cardápio')).toHaveClass('preview-sticky')
  })

  it('applies header, layout and card choices to the live preview', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.click(screen.getByRole('button', { name: 'Faixa de destaque' }))
    await user.click(screen.getByRole('button', { name: 'Compacto' }))
    await user.click(screen.getByRole('button', { name: 'Dividido' }))

    expect(container.querySelector('.paper')).toHaveClass('header-banner', 'layout-compact', 'cards-split')
  })
})
