import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { MenuDocument, MenuTheme } from '../domain/menu'
import { formatPrice } from '../domain/menu'

const palette: Record<MenuTheme, { background: string; surface: string; ink: string; accent: string }> = {
  rose: { background: '#fdf5f2', surface: '#fffaf8', ink: '#542f34', accent: '#b86676' },
  cocoa: { background: '#f6efe8', surface: '#fffaf5', ink: '#45251d', accent: '#a7603f' },
  vanilla: { background: '#fcf8ed', surface: '#fffdf7', ink: '#53432c', accent: '#ac8b47' },
}

const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: 'Helvetica', fontSize: 10 },
  header: { alignItems: 'center', marginBottom: 24 },
  business: { fontSize: 8, letterSpacing: 2.4, marginBottom: 7 },
  title: { fontFamily: 'Times-Roman', fontSize: 29, textAlign: 'center', marginBottom: 7 },
  subtitle: { fontSize: 10, textAlign: 'center', maxWidth: 360, lineHeight: 1.4 },
  rule: { borderBottomWidth: 1, width: 120, marginTop: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48.5%', borderWidth: 1, borderRadius: 8, padding: 11, minHeight: 96 },
  image: { width: 58, height: 58, borderRadius: 29, objectFit: 'cover', marginBottom: 9 },
  placeholder: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', marginBottom: 9, fontSize: 24 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemName: { fontFamily: 'Times-Bold', fontSize: 13, flexShrink: 1 },
  price: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  description: { marginTop: 6, lineHeight: 1.4, color: '#695d58' },
  footer: { position: 'absolute', bottom: 28, left: 42, right: 42, textAlign: 'center', fontSize: 8 },
  pageNumber: { position: 'absolute', bottom: 16, right: 42, fontSize: 7 },
})

export function MenuPdfDocument({ menu }: { menu: MenuDocument }) {
  const colors = palette[menu.theme]
  const items = menu.items.filter((item) => item.name.trim())
  return <Document title={menu.title || 'Cardápio de doces'} author={menu.businessName}>
    <Page size="A4" style={[styles.page, { backgroundColor: colors.background, color: colors.ink }]} wrap>
      <View style={styles.header} fixed><Text style={[styles.business, { color: colors.accent }]}>{menu.businessName || 'SUA MARCA'}</Text><Text style={styles.title}>{menu.title || 'Seu cardápio'}</Text>{menu.subtitle ? <Text style={styles.subtitle}>{menu.subtitle}</Text> : null}<View style={[styles.rule, { borderColor: colors.accent }]} /></View>
      <View style={styles.grid}>{items.map((item) => <View key={item.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.accent }]} wrap={false}>{item.image ? <Image src={item.image} style={styles.image} /> : <View style={[styles.placeholder, { backgroundColor: colors.background, color: colors.accent }]}><Text>⌁</Text></View>}<View style={styles.cardTop}><Text style={styles.itemName}>{item.name}</Text><Text style={[styles.price, { color: colors.accent }]}>{formatPrice(item.priceInCents)}</Text></View>{item.description ? <Text style={styles.description}>{item.description}</Text> : null}</View>)}</View>
      {menu.contact ? <Text style={[styles.footer, { color: colors.accent }]} fixed>{menu.contact}</Text> : null}
      <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
    </Page>
  </Document>
}
