const AdminModal = ({ open, title, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="admin-modal-mask" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button type="button" className="admin-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="admin-modal__body">{children}</div>
        {footer && <div className="admin-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default AdminModal;
