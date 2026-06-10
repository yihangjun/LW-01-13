import { useContext, useMemo, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirm from '../../components/admin/AdminConfirm';
import './Admin.css';

const emptyForm = () => ({ id: '', name: '', children: [] });

function loadCategoryRows(category) {
  return (category.getList() || [])
    .filter((c) => c?.id)
    .map((c) => ({
      id: c.id,
      name: c.name,
      children: (c.children || []).filter((ch) => ch?.id).map((ch) => ({ ...ch })),
    }));
}

const AdminCategoriesPage = () => {
  const { category, admin } = useContext(ServiceContext);
  const [categoryRows, setCategoryRows] = useState(() => loadCategoryRows(category));
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(loadCategoryRows(category)));
  const [keyword, setKeyword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState('');
  const [saveHint, setSaveHint] = useState('');

  const hasPermission = admin.hasPermission('categories');
  const isDirty = JSON.stringify(categoryRows) !== savedSnapshot;

  const list = useMemo(() => {
    if (!keyword.trim()) return categoryRows;
    const q = keyword.trim();
    return categoryRows.filter(
      (c) => c.name.includes(q) || c.id.includes(q),
    );
  }, [categoryRows, keyword]);

  const deleteTarget = deleteId
    ? categoryRows.find((c) => c.id === deleteId)
    : null;

  const showSavedHint = () => {
    setSaveHint('已保存');
    setTimeout(() => setSaveHint(''), 2000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    if (!c?.id) return;
    setEditingId(c.id);
    setForm({
      id: c.id,
      name: c.name,
      children: c.children?.map((ch) => ({ ...ch })) ?? [],
    });
    setFormError('');
    setModalOpen(true);
  };

  const addChildRow = () => {
    setForm((f) => ({
      ...f,
      children: [
        ...f.children,
        { id: `${f.id || 'sub'}-${Date.now()}`, name: '' },
      ],
    }));
  };

  const updateChildName = (index, name) => {
    setForm((f) => ({
      ...f,
      children: f.children.map((ch, i) => (i === index ? { ...ch, name } : ch)),
    }));
  };

  const removeChildRow = (index) => {
    setForm((f) => ({
      ...f,
      children: f.children.filter((_, i) => i !== index),
    }));
  };

  const handleModalSubmit = () => {
    if (!form.name.trim()) {
      setFormError('请输入分类名称');
      return;
    }
    const children = form.children
      .filter((ch) => ch.name?.trim())
      .map((ch) => ({
        id: ch.id.trim() || `${form.id}-${ch.name}`,
        name: ch.name.trim(),
      }));

    if (editingId) {
      setCategoryRows((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: form.name.trim(), children }
            : c,
        ),
      );
    } else {
      if (!form.id.trim()) {
        setFormError('请输入分类 ID');
        return;
      }
      if (categoryRows.some((c) => c.id === form.id.trim())) {
        setFormError('分类 ID 已存在');
        return;
      }
      setCategoryRows((prev) => [
        ...prev,
        { id: form.id.trim(), name: form.name.trim(), children },
      ]);
    }
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    category.replaceAll(categoryRows);
    const snapshot = JSON.stringify(categoryRows);
    setSavedSnapshot(snapshot);
    showSavedHint();
  };

  const handleReset = () => {
    const fresh = loadCategoryRows(category);
    setCategoryRows(fresh);
    setSavedSnapshot(JSON.stringify(fresh));
    setSaveHint('');
    setKeyword('');
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setCategoryRows((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  if (!hasPermission) {
    return <div className="admin-panel">无分类管理权限</div>;
  }

  return (
    <>
      <section className="admin-card">
        <div className="admin-card__title">筛选搜索</div>
        <div className="admin-filter-grid">
          <label className="admin-form-item">
            <span>分类名称</span>
            <input
              placeholder="名称或 ID"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
          <div className="admin-filter-actions">
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--sm"
              onClick={() => setKeyword('')}
            >
              重置
            </button>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <div className="admin-card__title">分类列表</div>
            <p className="admin-card__desc">
              编辑分类与子分类后，点击保存生效
              {isDirty && <span className="admin-dirty-hint"> · 有未保存的修改</span>}
              {saveHint && <span className="admin-save-hint"> · {saveHint}</span>}
            </p>
          </div>
          <div className="admin-card__actions">
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={openAdd}>
              添加分类
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--sm"
              onClick={handleReset}
              disabled={!isDirty}
            >
              重置
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              保存
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>子分类</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    {c.children?.length ? (
                      <span className="admin-tag-list">
                        {c.children.map((ch) => (
                          <span key={ch.id} className="admin-chip">{ch.name}</span>
                        ))}
                      </span>
                    ) : (
                      <span className="admin-muted">无</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-link" onClick={() => openEdit(c)}>编辑</button>
                      <button type="button" className="admin-link admin-link--danger" onClick={() => setDeleteId(c.id)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={4} className="admin-table__empty">暂无分类</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal
        open={modalOpen}
        title={editingId ? '编辑分类' : '添加分类'}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        footer={
          <>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setModalOpen(false)}>取消</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={handleModalSubmit}>确定</button>
          </>
        }
      >
        {formError && <p className="admin-error">{formError}</p>}
        <div className="admin-form-grid">
          {!editingId && (
            <label className="admin-form-item">
              <span>分类 ID</span>
              <input placeholder="如 7" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            </label>
          )}
          <label className="admin-form-item admin-form-item--full">
            <span>分类名称</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
        </div>
        <div className="admin-subcategory-editor">
          <div className="admin-subcategory-editor__head">
            <strong>子分类</strong>
            <button type="button" className="admin-link" onClick={addChildRow}>+ 添加子分类</button>
          </div>
          {form.children.length === 0 ? (
            <p className="admin-muted">暂无子分类，可点击上方添加</p>
          ) : (
            <ul className="admin-subcategory-list">
              {form.children.map((ch, index) => (
                <li key={ch.id || index}>
                  <input
                    placeholder="子分类名称"
                    value={ch.name}
                    onChange={(e) => updateChildName(index, e.target.value)}
                  />
                  <button type="button" className="admin-link admin-link--danger" onClick={() => removeChildRow(index)}>删除</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="admin-form-hint">弹窗内修改需点「确定」；写入前台需再点列表上方「保存」</p>
      </AdminModal>

      <AdminConfirm
        open={!!deleteTarget}
        message={`确定删除分类「${deleteTarget?.name ?? ''}」吗？删除后需点击保存才生效`}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminCategoriesPage;
