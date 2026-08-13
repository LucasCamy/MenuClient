import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import {
  backgroundPatterns,
  cardLayouts,
  cardStyles,
  createItem,
  defaultMenu,
  formatPrice,
  getThemeColors,
  headerStyles,
  menuTemplates,
  menuThemes,
  normalizeMenu,
  type BackgroundPattern,
  type CardLayout,
  type CardStyle,
  type HeaderStyle,
  type MenuColors,
  type MenuDesign,
  type MenuDocument,
  type MenuItem,
  type MenuTemplate,
  type MenuTheme,
} from './domain/menu'
import { downloadMenuPdf } from './pdf/downloadMenuPdf'

const STORAGE_KEY = 'doce-menu:draft:v3'

const moneyToCents = (value: string) => Math.round((Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0) * 100)
const readImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = reject
  reader.readAsDataURL(file)
})

export default function App() {
  const [menu, setMenu] = useState<MenuDocument>(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('doce-menu:draft:v2') ?? localStorage.getItem('doce-menu:draft:v1')
      return draft ? normalizeMenu(JSON.parse(draft)) : defaultMenu
    } catch {
      return defaultMenu
    }
  })
  const [isExporting, setIsExporting] = useState(false)
  const [status, setStatus] = useState('Salvo neste navegador')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(menu)) }, [menu])

  const updateMenu = (field: Exclude<keyof MenuDocument, 'items' | 'design'>, value: string) => setMenu((current) => ({ ...current, [field]: value }))
  const updateDesign = <K extends keyof MenuDesign>(field: K, value: MenuDesign[K]) => setMenu((current) => ({ ...current, design: { ...current.design, [field]: value } }))
  const updateItem = (id: string, field: keyof MenuItem, value: string | number | undefined) => setMenu((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, [field]: value } : item) }))
  const updateColor = (field: keyof MenuColors, value: string) => setMenu((current) => ({ ...current, design: { ...current.design, colors: { ...getThemeColors(current), [field]: value } } }))
  const selectTheme = (theme: MenuTheme) => setMenu((current) => ({ ...current, theme, design: { ...current.design, colors: undefined } }))
  const removeItem = (id: string) => setMenu((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }))

  const exportName = useMemo(() => `menu-${(menu.businessName || 'doces').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'doces'}.pdf`, [menu.businessName])
  const colors = getThemeColors(menu)

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, apply: (image: string) => void) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setStatus('Escolha uma imagem em JPG, PNG ou WebP.')
    if (file.size > 3 * 1024 * 1024) return setStatus('A imagem deve ter no máximo 3 MB.')
    apply(await readImage(file))
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

  return <main className={`app template-${menu.design.template}`}>
    <header className="topbar"><div className="brand"><span>✦</span> doce menu</div><p className="save-status" aria-live="polite">{status}</p><button className="primary-button" onClick={handleExport} disabled={isExporting || !menu.items.some((item) => item.name.trim())}>{isExporting ? 'Gerando PDF…' : 'Baixar PDF'}</button></header>
    <section className="workspace">
      <aside className="editor" aria-label="Editor do cardápio">
        <div className="editor-intro"><p className="eyebrow">SEU CARDÁPIO</p><h1>Crie seu cardápio</h1><p>Escolha modelos, cores, fundos e formatos até encontrar o seu estilo.</p></div>
        <BasicInformation menu={menu} updateMenu={updateMenu} />
        <ModelSettings menu={menu} updateDesign={updateDesign} />
        <ColorAndBackgroundSettings menu={menu} colors={colors} selectTheme={selectTheme} updateDesign={updateDesign} updateColor={updateColor} uploadImage={uploadImage} />
        <CardSettings menu={menu} updateDesign={updateDesign} />
        <ItemsEditor menu={menu} updateItem={updateItem} uploadImage={uploadImage} removeItem={removeItem} addItem={() => setMenu((current) => ({ ...current, items: [...current.items, createItem()] }))} />
      </aside>
      <section className="preview-area preview-sticky" aria-label="Prévia do cardápio"><div className="preview-toolbar"><span className="preview-label"><i /> Prévia ao vivo</span><span>A4 · multipágina</span></div><MenuPreview menu={menu} /></section>
    </section>
  </main>
}

function BasicInformation({ menu, updateMenu }: { menu: MenuDocument; updateMenu: (field: Exclude<keyof MenuDocument, 'items' | 'design'>, value: string) => void }) {
  return <section className="editor-section"><h2>Informações principais</h2><label>Nome da marca<input value={menu.businessName} onChange={(event) => updateMenu('businessName', event.target.value)} placeholder="Ex.: Doçura da Casa" /></label><label>Título do cardápio<input value={menu.title} onChange={(event) => updateMenu('title', event.target.value)} placeholder="Ex.: Cardápio de doces" /></label><label>Subtítulo <span className="optional">opcional</span><input value={menu.subtitle} onChange={(event) => updateMenu('subtitle', event.target.value)} placeholder="Uma frase especial" /></label><label>Contato / encomendas <span className="optional">opcional</span><input value={menu.contact} onChange={(event) => updateMenu('contact', event.target.value)} placeholder="Ex.: WhatsApp (11) 99999-9999" /></label></section>
}

function ModelSettings({ menu, updateDesign }: { menu: MenuDocument; updateDesign: <K extends keyof MenuDesign>(field: K, value: MenuDesign[K]) => void }) {
  return <section className="editor-section"><h2>Modelo do cardápio</h2><p className="section-note">A composição define o título, o ritmo e os detalhes do papel.</p><div className="template-options">{menuTemplates.map((template) => <button key={template.id} className={`template-option ${menu.design.template === template.id ? 'selected' : ''}`} onClick={() => updateDesign('template', template.id as MenuTemplate)}><span className={`template-thumbnail ${template.id}`}><i /><i /><i /></span><b>{template.label}</b><small>{template.description}</small></button>)}</div><OptionChoices label="Posição do título" options={headerStyles} selected={menu.design.headerStyle} onSelect={(value) => updateDesign('headerStyle', value as HeaderStyle)} /></section>
}

function ColorAndBackgroundSettings({ menu, colors, selectTheme, updateDesign, updateColor, uploadImage }: { menu: MenuDocument; colors: MenuColors; selectTheme: (theme: MenuTheme) => void; updateDesign: <K extends keyof MenuDesign>(field: K, value: MenuDesign[K]) => void; updateColor: (field: keyof MenuColors, value: string) => void; uploadImage: (event: ChangeEvent<HTMLInputElement>, apply: (image: string) => void) => Promise<void> }) {
  return <section className="editor-section"><h2>Cores e fundo</h2><p className="section-note">Combine uma paleta, um padrão ou uma foto sua.</p><div className="theme-options expanded" role="radiogroup" aria-label="Paleta de cores">{menuThemes.map((theme) => <button key={theme.id} className={`theme-option ${menu.theme === theme.id && !menu.design.colors ? 'selected' : ''}`} role="radio" aria-checked={menu.theme === theme.id && !menu.design.colors} onClick={() => selectTheme(theme.id)}><i className="theme-swatch" style={{ background: theme.colors.accent }} /><span>{theme.label}<small>{theme.description}</small></span></button>)}</div><PatternChoices selected={menu.design.backgroundPattern} onSelect={(value) => updateDesign('backgroundPattern', value as BackgroundPattern)} /><div className="color-controls"><ColorInput label="Fundo" value={colors.background} onChange={(value) => updateColor('background', value)} /><ColorInput label="Cards" value={colors.surface} onChange={(value) => updateColor('surface', value)} /><ColorInput label="Texto" value={colors.ink} onChange={(value) => updateColor('ink', value)} /><ColorInput label="Destaque" value={colors.accent} onChange={(value) => updateColor('accent', value)} /></div><button className="text-button" onClick={() => updateDesign('colors', undefined)}>Restaurar cores da paleta</button><label className="background-upload">Imagem de fundo <span className="optional">opcional</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadImage(event, (image) => updateDesign('backgroundImage', image))} /></label>{menu.design.backgroundImage && <><label>Transparência da imagem <output>{menu.design.backgroundOpacity}%</output><input type="range" min="0" max="70" value={menu.design.backgroundOpacity} onChange={(event) => updateDesign('backgroundOpacity', Number(event.target.value))} /></label><button className="text-button" onClick={() => updateDesign('backgroundImage', undefined)}>Remover imagem de fundo</button></>}</section>
}

function CardSettings({ menu, updateDesign }: { menu: MenuDocument; updateDesign: <K extends keyof MenuDesign>(field: K, value: MenuDesign[K]) => void }) {
  return <section className="editor-section"><h2>Cards dos doces</h2><OptionChoices label="Organização" options={cardLayouts} selected={menu.design.cardLayout} onSelect={(value) => updateDesign('cardLayout', value as CardLayout)} /><OptionChoices label="Estilo visual" options={cardStyles} selected={menu.design.cardStyle} onSelect={(value) => updateDesign('cardStyle', value as CardStyle)} /></section>
}

function OptionChoices({ label, options, selected, onSelect }: { label: string; options: Array<{ id: string; label: string; description: string }>; selected: string; onSelect: (value: string) => void }) {
  return <div className="option-choices"><span>{label}</span><div>{options.map((option) => <button key={option.id} className={selected === option.id ? 'selected' : ''} title={option.description} onClick={() => onSelect(option.id)}>{option.label}</button>)}</div></div>
}

function PatternChoices({ selected, onSelect }: { selected: BackgroundPattern; onSelect: (value: string) => void }) {
  return <div className="background-patterns" role="radiogroup" aria-label="Modelo de fundo">{backgroundPatterns.map((pattern) => <button key={pattern.id} className={`pattern-option ${pattern.id} ${selected === pattern.id ? 'selected' : ''}`} role="radio" aria-checked={selected === pattern.id} title={pattern.description} onClick={() => onSelect(pattern.id)}><i /><span>{pattern.label}</span></button>)}</div>
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label>{label}<input type="color" value={value} onChange={(event) => onChange(event.target.value)} /></label> }

function ItemsEditor({ menu, updateItem, uploadImage, removeItem, addItem }: { menu: MenuDocument; updateItem: (id: string, field: keyof MenuItem, value: string | number | undefined) => void; uploadImage: (event: ChangeEvent<HTMLInputElement>, apply: (image: string) => void) => Promise<void>; removeItem: (id: string) => void; addItem: () => void }) {
  return <section className="editor-section products-section"><div className="section-heading"><div><h2>Doces</h2><p>{menu.items.length} {menu.items.length === 1 ? 'item' : 'itens'} · páginas automáticas</p></div><button className="add-button" onClick={addItem}>+ Adicionar</button></div><div className="product-list">{menu.items.map((item, index) => <article className="product-editor" key={item.id}><div className="product-number">{String(index + 1).padStart(2, '0')}</div><div className="product-fields"><label>Nome<input value={item.name} onChange={(event) => updateItem(item.id, 'name', event.target.value)} placeholder="Nome do doce" /></label><div className="two-columns"><label>Preço<input value={item.priceInCents ? (item.priceInCents / 100).toFixed(2).replace('.', ',') : ''} onChange={(event) => updateItem(item.id, 'priceInCents', moneyToCents(event.target.value))} inputMode="decimal" placeholder="0,00" /></label><label>Foto <span className="optional">opcional</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadImage(event, (image) => updateItem(item.id, 'image', image))} /></label></div><label>Descrição <span className="optional">opcional</span><textarea value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} placeholder="Ingredientes ou detalhes especiais" rows={2} /></label><div className="product-actions"><span>{item.image ? 'Foto adicionada' : 'Sem foto'}</span>{item.image && <button onClick={() => updateItem(item.id, 'image', undefined)}>Remover foto</button>}<button className="danger" onClick={() => removeItem(item.id)} disabled={menu.items.length === 1}>Remover item</button></div></div></article>)}</div></section>
}

export function MenuPreview({ menu }: { menu: MenuDocument }) {
  const items = menu.items.filter((item) => item.name.trim())
  const colors = getThemeColors(menu)
  const style = { '--menu-bg': colors.background, '--menu-surface': colors.surface, '--menu-ink': colors.ink, '--menu-accent': colors.accent } as CSSProperties
  return <div className={`paper template-${menu.design.template} header-${menu.design.headerStyle} pattern-${menu.design.backgroundPattern} layout-${menu.design.cardLayout} cards-${menu.design.cardStyle}`} style={style}><div className="background-image" style={menu.design.backgroundImage ? { backgroundImage: `linear-gradient(rgba(255,255,255,${menu.design.backgroundOpacity / 100}), rgba(255,255,255,${menu.design.backgroundOpacity / 100})), url(${menu.design.backgroundImage})` } : undefined} /><div className="paper-content"><div className="paper-ornament">✦</div><header className="menu-header"><p className="menu-brand">{menu.businessName || 'SUA MARCA'}</p><h2>{menu.title || 'Seu cardápio'}</h2>{menu.subtitle && <p className="menu-subtitle">{menu.subtitle}</p>}<div className="header-rule"><span>✦</span></div></header><div className="menu-grid">{items.map((item) => <article key={item.id} className="menu-card">{item.image ? <img src={item.image} alt={item.name} /> : <div className="sweet-placeholder">⌁</div>}<div className="card-copy"><div className="card-title-row"><h3>{item.name}</h3><strong>{formatPrice(item.priceInCents)}</strong></div>{item.description && <p>{item.description}</p>}</div></article>)}</div>{!items.length && <div className="empty-preview">Adicione um doce para começar a montar seu cardápio.</div>}{menu.contact && <footer>{menu.contact}</footer>}</div></div>
}
