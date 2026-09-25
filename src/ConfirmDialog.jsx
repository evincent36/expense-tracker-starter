import { useEffect, useRef } from 'react'

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    // Guard: StrictMode runs effects twice in development.
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleCancelEvent = (e) => {
    // Esc key: let the parent's state decide when the dialog goes away.
    e.preventDefault();
    onCancel();
  };

  const handleClick = (e) => {
    // Clicks on the <dialog> itself (not its content) are backdrop clicks.
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      onCancel={handleCancelEvent}
      onClick={handleClick}
    >
      <div className="confirm-dialog-content">
        <h3 id="confirm-dialog-title">{title}</h3>
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-dialog-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog
