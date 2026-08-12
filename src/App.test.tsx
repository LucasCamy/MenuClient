import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the menu editor and the live preview', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Crie seu cardápio' })).toBeInTheDocument()
    expect(screen.getByText('Prévia ao vivo')).toBeInTheDocument()
  })
})
