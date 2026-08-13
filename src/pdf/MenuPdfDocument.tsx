import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { MenuDocument } from '../domain/menu'
import { formatPrice, getThemeColors } from '../domain/menu'

const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: 'Helvetica', fontSize: 10 },
  backgroundImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, objectFit: 'cover' },
  patternLayer: { position: 'absolute', top: 24, left: 20, right: 20, fontSize: 26, lineHeight: 2.65, letterSpacing: 13 },
  patternFine: { fontSize: 17, lineHeight: 3.5, letterSpacing: 8 },
  header: { alignItems: 'center', marginBottom: 24 },
  headerLeft: { alignItems: 'flex-start' },
  headerBanner: { alignItems: 'center', padding: 16, borderRadius: 6, marginBottom: 22 },
  business: { fontSize: 8, letterSpacing: 2.4, marginBottom: 7 },
  title: { fontFamily: 'Times-Roman', fontSize: 29, textAlign: 'center', marginBottom: 7 },
  titleLeft: { textAlign: 'left' },
  subtitle: { fontSize: 10, textAlign: 'center', maxWidth: 360, lineHeight: 1.4 },
  subtitleLeft: { textAlign: 'left' },
  rule: { borderBottomWidth: 1, width: 120, marginTop: 14 },
  ruleLeft: { marginLeft: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  compact: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  list: { flexDirection: 'column', gap: 10 },
  card: { borderWidth: 1, borderRadius: 8, padding: 11, minHeight: 96 },
  gridCard: { width: '48.5%' },
  compactCard: { width: '31.7%', minHeight: 72, padding: 8 },
  listCard: { width: '100%', minHeight: 80 },
  image: { width: 58, height: 58, borderRadius: 29, objectFit: 'cover', marginBottom: 9 },
  compactImage: { width: 40, height: 40, borderRadius: 20, marginBottom: 6 },
  placeholder: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', marginBottom: 9, fontSize: 24 },
  compactPlaceholder: { width: 40, height: 40, borderRadius: 20, marginBottom: 6, fontSize: 17 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemName: { fontFamily: 'Times-Bold', fontSize: 13, flexShrink: 1 },
  compactName: { fontSize: 10 },
  price: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  compactPrice: { fontSize: 8 },
  description: { marginTop: 6, lineHeight: 1.4 },
  compactDescription: { fontSize: 8, marginTop: 3 },
  footer: { position: 'absolute', bottom: 28, left: 42, right: 42, textAlign: 'center', fontSize: 8 },
  pageNumber: { position: 'absolute', bottom: 16, right: 42, fontSize: 7 },
})

export function MenuPdfDocument({ menu }: { menu: MenuDocument }) {
  const colors = getThemeColors(menu)
  const items = menu.items.filter((item) => item.name.trim())
  const layout = menu.design.cardLayout
  const isCompact = layout === 'compact'
  const isList = layout === 'list'
  const isMinimal = menu.design.cardStyle === 'minimal'
  const isOutlined = menu.design.cardStyle === 'outlined'
  const isSplit = menu.design.cardStyle === 'split'
  const titleSize = menu.design.template === 'bold' ? 34 : menu.design.template === 'modern' ? 25 : menu.design.template === 'romantic' ? 32 : 29
  const headerStyle = menu.design.headerStyle
  const cardBackground = isMinimal ? colors.background : colors.surface
  const pattern = patternText(menu.design.backgroundPattern)
  return <Document title={menu.title || 'Cardápio de doces'} author={menu.businessName}>
    <Page size="A4" style={[styles.page, { backgroundColor: colors.background, color: colors.ink }]} wrap>
      {menu.design.backgroundImage ? <Image src={menu.design.backgroundImage} style={[styles.backgroundImage, { opacity: menu.design.backgroundOpacity / 100 }]} fixed /> : null}
      {pattern ? <Text style={[styles.patternLayer, pattern.fine ? styles.patternFine : {}, { color: colors.accent, opacity: pattern.opacity }]} fixed>{pattern.text}</Text> : null}
      <View style={[styles.header, headerStyle === 'left' ? styles.headerLeft : {}, headerStyle === 'banner' ? [styles.headerBanner, { backgroundColor: colors.accent }] : {}]} fixed><Text style={[styles.business, { color: headerStyle === 'banner' ? colors.surface : colors.accent }]}>{menu.businessName || 'SUA MARCA'}</Text><Text style={[styles.title, { fontSize: titleSize, color: headerStyle === 'banner' ? colors.surface : colors.ink }, headerStyle === 'left' ? styles.titleLeft : {}]}>{menu.title || 'Seu cardápio'}</Text>{menu.subtitle ? <Text style={[styles.subtitle, { color: headerStyle === 'banner' ? colors.surface : colors.ink }, headerStyle === 'left' ? styles.subtitleLeft : {}]}>{menu.subtitle}</Text> : null}<View style={[styles.rule, { borderColor: headerStyle === 'banner' ? colors.surface : colors.accent }, headerStyle === 'left' ? styles.ruleLeft : {}]} /></View>
      <View style={isList ? styles.list : isCompact ? styles.compact : styles.grid}>{items.map((item) => <View key={item.id} style={[styles.card, isList ? styles.listCard : isCompact ? styles.compactCard : styles.gridCard, { backgroundColor: cardBackground, borderColor: colors.accent, borderWidth: isOutlined ? 1.4 : isMinimal ? 0 : 1, borderRadius: menu.design.cardStyle === 'label' ? 0 : 8, flexDirection: isSplit && item.image ? 'row' : 'column', gap: isSplit && item.image ? 10 : 0 }]} wrap={false}>{item.image ? <Image src={item.image} style={[styles.image, isCompact ? styles.compactImage : {}]} /> : <View style={[styles.placeholder, { backgroundColor: colors.background, color: colors.accent }, isCompact ? styles.compactPlaceholder : {}]}><Text>⌁</Text></View>}<View style={styles.cardTop}><Text style={[styles.itemName, isCompact ? styles.compactName : {}]}>{item.name}</Text><Text style={[styles.price, { color: menu.design.cardStyle === 'label' ? colors.surface : colors.accent, backgroundColor: menu.design.cardStyle === 'label' ? colors.accent : undefined }, isCompact ? styles.compactPrice : {}]}>{formatPrice(item.priceInCents)}</Text></View>{item.description ? <Text style={[styles.description, { color: colors.ink }, isCompact ? styles.compactDescription : {}]}>{item.description}</Text> : null}</View>)}</View>
      {menu.contact ? <Text style={[styles.footer, { color: colors.accent }]} fixed>{menu.contact}</Text> : null}<Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
    </Page>
  </Document>
}

function patternText(pattern: MenuDocument['design']['backgroundPattern']) {
  const patterns = {
    clean: null,
    confetti: { text: '•  ✦  •  ✦  •  ✦  •\n\n✦  •  ✦  •  ✦  •  ✦\n\n•  ✦  •  ✦  •  ✦  •', opacity: 0.16, fine: false },
    waves: { text: '⌒  ⌒  ⌒  ⌒  ⌒\n\n⌒  ⌒  ⌒  ⌒  ⌒\n\n⌒  ⌒  ⌒  ⌒  ⌒', opacity: 0.14, fine: false },
    botanical: { text: '❦  ✦  ❦  ✦  ❦\n\n✦  ❦  ✦  ❦  ✦\n\n❦  ✦  ❦  ✦  ❦', opacity: 0.12, fine: false },
    checker: { text: '▪  ▫  ▪  ▫  ▪  ▫\n▪  ▫  ▪  ▫  ▪  ▫\n▪  ▫  ▪  ▫  ▪  ▫', opacity: 0.12, fine: true },
    sprinkles: { text: '/  –  /  –  /  –  /\n\n–  /  –  /  –  /  –\n\n/  –  /  –  /  –  /', opacity: 0.15, fine: false },
    ribbons: { text: '╱  ╱  ╱  ╱  ╱  ╱\n\n╱  ╱  ╱  ╱  ╱  ╱\n\n╱  ╱  ╱  ╱  ╱  ╱', opacity: 0.12, fine: false },
    scallop: { text: '◡  ◡  ◡  ◡  ◡  ◡\n\n◡  ◡  ◡  ◡  ◡  ◡\n\n◡  ◡  ◡  ◡  ◡  ◡', opacity: 0.15, fine: false },
    dots: { text: '·  ·  ·  ·  ·  ·  ·\n·  ·  ·  ·  ·  ·  ·\n·  ·  ·  ·  ·  ·  ·', opacity: 0.18, fine: true },
    marble: { text: '〰  〰  〰  〰\n\n  〰  〰  〰  〰\n\n〰  〰  〰  〰', opacity: 0.11, fine: false },
  } as const
  return patterns[pattern]
}
