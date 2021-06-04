import { Dialog, DialogTitle } from '@material-ui/core'
import React from 'react'

interface PopupProps {
  children: React.ReactElement;
  handlePopupClose: () => void;
  open: boolean;
  title?: string;
}

export default function Popup({
 children,
 handlePopupClose,
 open,
 title
}: PopupProps) {
  return (
    <Dialog open={open} onClose={handlePopupClose}>
    <DialogTitle>
      {title}
    </DialogTitle>
    {children}
  </Dialog>
  )
}
