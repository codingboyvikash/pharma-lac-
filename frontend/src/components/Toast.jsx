export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`app-toast alert alert-${type} shadow-sm`} role="alert">
      <span>{message}</span>
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
    </div>
  );
}
