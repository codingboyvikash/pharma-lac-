export default function ConfirmModal({ show, title = 'Confirm delete', message, onCancel, onConfirm }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p className="mb-0">{message || 'This action cannot be undone.'}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
