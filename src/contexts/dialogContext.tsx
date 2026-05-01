'use client'

import React, { createContext, useState, useContext, ReactNode, ComponentType } from 'react'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'

interface DialogState {
  component: ComponentType<any> | null
  props?: any
  open: boolean
}

interface DialogContextType {
  openDialog: (component: ComponentType<any>, props?: any) => void
  closeDialog: () => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    component: null,
    props: {},
    open: false
  })

  const openDialog = (component: ComponentType<any>, props?: any) => {
    setDialogState({
      component,
      props,
      open: true
    })
  }

  const closeDialog = () => {
    setDialogState({
      component: null,
      props: {},
      open: false
    })
  }

  const RenderedComponent = dialogState.component

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Dialog
        open={dialogState.open}
        onClose={closeDialog}
        fullWidth
        maxWidth='lg'
        sx={{ '& .MuiDialog-paper': { position: 'relative' } }}
      >
        {RenderedComponent && (
          <>
            <IconButton onClick={closeDialog} sx={{ position: 'absolute', right: 10, top: 10 }}>
              <i className='ri-close-line'></i>
            </IconButton>

            <div style={{ padding: '20px 20px' }}>
              {/* ✅ FIX */}
              <RenderedComponent {...dialogState.props} onClose={closeDialog} />
            </div>
          </>
        )}
      </Dialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog must be used within a DialogProvider')
  return context
}
