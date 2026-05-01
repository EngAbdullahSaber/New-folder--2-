'use client'

import React from 'react'
import Barcode from 'react-barcode'

interface FooterPrintProps {
  showBarcode?: boolean
  recordId?: string
  barcodes?: { value: string; label?: string }[]
}

export const FooterPrint: React.FC<FooterPrintProps> = ({ showBarcode = true, recordId, barcodes = [] }) => {
  if (!showBarcode) return null

  const defaultBarcode: { value: string; label?: string }[] = recordId ? [{ value: String(recordId) }] : []
  const barcodesToRender = barcodes.length > 0 ? barcodes : defaultBarcode

  return (
    <div className='footer-print-container' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
      {barcodesToRender
        .filter(bc => bc.value && String(bc.value).trim() !== '')
        .map((bc, index) => (
          <div key={index} className='footer-barcode' style={{ textAlign: 'center' }}>
            <Barcode value={bc.value} width={1} height={60} fontSize={10} background='transparent' />
            {bc.label && <div style={{ fontSize: '10px', marginTop: '2px' }}>{bc.label}</div>}
          </div>
        ))}
    </div>
  )
}

export default FooterPrint
