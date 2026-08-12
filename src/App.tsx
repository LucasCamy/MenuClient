import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { createItem, defaultMenu, formatPrice, type MenuDocument, type MenuItem, type MenuTheme } from './domain/menu'
import { downloadMenuPdf } from './pdf/downloadMenuPdf'

const STORAGE_KEY = 'doce-menu:draft:v1'

const themeLabels: Record<MenuTheme, string> = {
  rose: 'Rosé delicado',
  cocoa: 'Chocolate artesanal',
  vanilla: 'Baunilha clássica',
}

const moneyToCents = (value: string) => {
  const normalized = value.replace(/[^\d,]/g, '').replace(',', '.')
  return Math.round((Number(normalized) || 0) * 100)
}

const readImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = reject
  reader.readAsDataURL(file)
})

export default function App() {
  const [menu, setMenu] = useState<MenuDocument>(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY)
      return draft ? { ...defaultMenu, ...JSON.parse(draft) } : defaultMenu
    } catch {
      return defaultMenu
    }
  })
  const [isExporting, setIsExporting] = useState(false)
  const [status, setStatus] = useState('Salvo neste navegador')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menu))
  }, [menu])

  const updateMenu = (field: Exclude<keyof MenuDocument, 'items'>, value: string) => {
    setMenu((current) => ({ ...current, [field]: value }))
  }

  const updateItem = (id: string, field: keyof MenuItem, value: string | number | undefined) => {
    setMenu((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, [field]: value } : item),
    }))
  }

  const itemCount = menu.items.length
  const exportName = useMemo(
    () => `menu-${(menu.businessName || 'doces').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'doces'}.pdf`,
    [menu.businessName],
  )

  const handlePhoto = async (event: ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus('Escolha uma imagem em JPG, PNG ou WebP.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setStatus('A foto deve ter no máximo 3 MB.')
      return
    }
    updateItem(itemId, 'image', await readImage(file))
  }

  const handleExport = async () => {
    setIsExporting(true)
    setStatus('Gerando seu PDF…')
    try {
      await downloadMenuPdf(menu, exportName)
      setStatus('PDF baixado com sucesso!')
    } catch {
      setStatus('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className={`app theme-${menu.theme}`}>
      <header className="topbar">
        <div className="brand"><span>✦</span> doce menu</div>
        <p className="save-status" aria-live="polite">{status}</p>
        <button className="primary-button" onClick={handleExport} disabled={isExporting || !menu.items.some((item) => item.name.trim())}>
          {isExporting ? 'Gerando PDF…' : 'Baixar PDF'}
        </button>
      </header>

      <section className="workspace">
        <aside className="editor" aria-label="Editor do cardápio">
          <div className="editor-intro">
            <p className="eyebrow">SEU CARDÁPIO</p>
            <h1>Crie seu cardápio</h1>
            <p>Personalize os doces e veja cada detalhe antes de baixar.</p>
          </div>

          <section className="editor-section">
            <h2>Informações principais</h2>
            <label>Nome da marca<input value={menu.businessName} onChange={(e) => updateMenu('businessName', e.target.value)} placeholder="Ex.: Doçura da Casa" /></label>
            <label>Título do cardápio<input value={menu.title} onChange={(e) => updateMenu('title', e.target.value)} placeholder="Ex.: Cardápio de doces" /></label>
            <label>Subtítulo <span className="optional">opcional</span><input value={menu.subtitle} onChange={(e) => updateMenu('subtitle', e.target.value)} placeholder="Uma frase especial" /></label>
            <label>Contato / encomendas <span className="optional">opcional</span><input value={menu.contact} onChange={(e) => updateMenu('contact', e.target.value)} placeholder="Ex.: WhatsApp (11) 99999-9999" /></label>
          </section>

          <section className="editor-section">
            <h2>Estilo do menu</h2>
            <div className="theme-options" role="radiogroup" aria-label="Tema do menu">
              {(Object.keys(themeLabels) as MenuTheme[]).map((theme) => <button key={theme} className={`theme-option ${menu.theme === theme ? 'selected' : ''}`} role="radio" aria-checked={menu.theme === theme} onClick={() => updateMenu('theme', theme)}><i className={`theme-swatch ${theme}`} />{themeLabels[theme]}</button>)}
            </div>
          </section>

          <section className="editor-section products-section">
            <div className="section-heading"><div><h2>Doces</h2><p>{itemCount} {itemCount === 1 ? 'item' : 'itens'} · páginas automáticas</p></div><button className="add-button" onClick={() => setMenu((current) => ({ ...current, items: [...current.items, createItem()] }))}>+ Adicionar</button></div>
            <div className="product-list">
              {menu.items.map((item, index) => <article className="product-editor" key={item.id}>
                <div className="product-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="product-fields">
                  <label>Nome<input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Nome do doce" /></label>
                  <div className="two-columns"><label>Preço<input value={item.priceInCents ? (item.priceInCents / 100).toFixed(2).replace('.', ',') : ''} onChange={(e) => updateItem(item.id, 'priceInCents', moneyToCents(e.target.value))} inputMode="decimal" placeholder="0,00" /></label><label>Foto <span className="optional">opcional</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => void handlePhoto(e, item.id)} /></label></div>
                  <label>Descrição <span className="optional">opcional</span><textarea value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Ingredientes ou detalhes especiais" rows={2} /></label>
                  <div className="product-actions"><span>{item.image ? 'Foto adicionada' : 'Sem foto'}</span>{item.image && <button onClick={() => updateItem(item.id, 'image', undefined)}>Remover foto</button>}<button className="danger" onClick={() => setMenu((current) => ({ ...current, items: current.items.filter((candidate) => candidate.id !== item.id) }))} disabled={menu.items.length === 1}>Remover item</button></div>
                </div>
              </article>)}
            </div>
          </section>
        </aside>

        <section className="preview-area" aria-label="Prévia do cardápio">
          <div className="preview-toolbar"><span className="preview-label"><i /> Prévia ao vivo</span><span>A4 · multipágina</span></div>
          <MenuPreview menu={menu} />
        </section>
      </section>
    </main>
  )
}

function MenuPreview({ menu }: { menu: MenuDocument }) {
  const validItems = menu.items.filter((item) => item.name.trim())
  return <div className="paper">
    <div className="paper-ornament">✦</div>
    <header className="menu-header"><p className="menu-brand">{menu.businessName || 'SUA MARCA'}</p><h2>{menu.title || 'Seu cardápio'}</h2>{menu.subtitle && <p className="menu-subtitle">{menu.subtitle}</p>}<div className="header-rule"><span>✦</span></div></header>
    <div className="menu-grid">{validItems.map((item) => <article key={item.id} className={`menu-card ${item.image ? 'with-image' : ''}`}>{item.image ? <img src={item.image} alt={item.name} /> : <div className="sweet-placeholder">⌁</div>}<div className="card-copy"><div className="card-title-row"><h3>{item.name}</h3><strong>{formatPrice(item.priceInCents)}</strong></div>{item.description && <p>{item.description}</p>}</div></article>)}</div>
    {!validItems.length && <div className="empty-preview">Adicione um doce para começar a montar seu cardápio.</div>}
    {menu.contact && <footer>{menu.contact}</footer>}
  </div>
}
