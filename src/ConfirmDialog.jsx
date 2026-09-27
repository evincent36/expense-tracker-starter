import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@fluentui/react-components'

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  // Fluent's Dialog asks to close on Esc and backdrop clicks; the parent's
  // state decides when it actually goes away.
  const handleOpenChange = (_e, data) => {
    if (!data.open) onCancel();
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogSurface className="confirm-dialog">
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{message}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
            <Button appearance="primary" className="danger-button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export default ConfirmDialog
