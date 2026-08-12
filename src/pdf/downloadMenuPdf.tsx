import { pdf } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { MenuDocument } from '../domain/menu'
import { MenuPdfDocument } from './MenuPdfDocument'

export async function downloadMenuPdf(menu: MenuDocument, filename: string) {
  const pdfDocument = <MenuPdfDocument menu={menu} /> as unknown as ReactElement<DocumentProps>
  const blob = await pdf(pdfDocument).toBlob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
}
