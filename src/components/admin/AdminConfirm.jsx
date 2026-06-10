import AdminModal from './AdminModal';

const AdminConfirm = ({ open, title, message, onConfirm, onCancel }) => (
  <AdminModal
    open={open}
    title={title || '确认操作'}
    onClose={onCancel}
    footer={
      <>
        <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={onCancel}>
          取消
        </button>
        <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={onConfirm}>
          确定
        </button>
      </>
    }
  >
    <p className="admin-confirm__text">{message}</p>
  </AdminModal>
);

export default AdminConfirm;
