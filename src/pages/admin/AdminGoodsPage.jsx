import { useContext, useMemo, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import { useToast } from '../../components/Toast';
import { GOODS_TAG_HELP } from '../../constants/adminPermissions';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirm from '../../components/admin/AdminConfirm';
import ProductThumb from '../../components/ProductThumb';
import './Admin.css';

const emptyForm = () => ({
  name: '',
  price: '',
  brand: '',
  sku: '',
  stock: '',
  categoryId: '2-1',
  color: '#ccc',
  spec: '',
  onSale: true,
  isNew: false,
  isRecommended: false,
  isHot: false,
  sort: 99,
});

const AdminGoodsPage = () => {
  const toast = useToast();
  const { good, category, admin } = useContext(ServiceContext);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [onSaleFilter, setOnSaleFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState('');

  const hasPermission = admin.hasPermission('goods');
  const categories = (category.getList() || []).filter((c) => c?.id);

  const list = useMemo(() => {
    return good.getGoodList().filter((g) => {
      if (!g?.id) return false;
      if (keyword && !g.name.includes(keyword)) return false;
      if (categoryFilter && !category.goodsMatchCategory(g.categoryId, categoryFilter)) return false;
      if (onSaleFilter === '1' && !g.onSale) return false;
      if (onSaleFilter === '0' && g.onSale) return false;
      return true;
    });
  }, [good, keyword, categoryFilter, onSaleFilter, refreshKey]);

  const editing = editingId ? list.find((g) => g.id === editingId) : null;
  const deleteTarget = deleteId ? list.find((g) => g.id === deleteId) : null;

  if (!hasPermission) {
    return <div className="admin-panel">无商品管理权限</div>;
  }

  const bump = () => setRefreshKey((n) => n + 1);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (g) => {
    if (!g?.id) return;
    setEditingId(g.id);
    setForm({
      name: g.name,
      price: g.price,
      brand: g.brand,
      sku: g.sku,
      stock: g.stock,
      categoryId: g.categoryId,
      color: g.color,
      spec: g.spec,
      onSale: g.onSale,
      isNew: g.isNew,
      isRecommended: g.isRecommended,
      isHot: g.isHot,
      sort: g.sort,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setFormError('请输入商品名称');
      return;
    }
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!price || price <= 0) {
      setFormError('请输入有效价格');
      return;
    }
    if (!stock || stock < 0) {
      setFormError('请输入有效库存');
      return;
    }
    const payload = {
      ...form,
      name: form.name.trim(),
      price,
      stock,
      brand: form.brand.trim() || '品牌',
      sku: form.sku.trim() || `SKU-${Date.now()}`,
      spec: form.spec.trim() || '默认规格',
    };
    try {
      if (editing) {
        await good.updateGood({ ...editing, ...payload });
      } else {
        await good.addGood(payload);
      }
      setModalOpen(false);
      setEditingId(null);
      bump();
    } catch (err) {
      setFormError(err.message || '保存失败');
      toast(err.message || '保存失败', 'error');
    }
  };

  const getCategoryName = (id) => category.getDisplayInfo(id)?.label || id;

  return (
    <>
      <section className="admin-card">
        <div className="admin-card__title">筛选搜索</div>
        <div className="admin-filter-grid">
          <label className="admin-form-item">
            <span>商品名称</span>
            <input placeholder="请输入商品名称" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="admin-form-item">
            <span>商品分类</span>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">全部分类</option>
              {categories.map((c) => (
                <optgroup key={c.id} label={c.name}>
                  <option value={c.id}>{c.name}（全部）</option>
                  {(c.children || []).map((ch) => (
                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="admin-form-item">
            <span>上架状态</span>
            <select value={onSaleFilter} onChange={(e) => setOnSaleFilter(e.target.value)}>
              <option value="">全部</option>
              <option value="1">已上架</option>
              <option value="0">未上架</option>
            </select>
          </label>
          <div className="admin-filter-actions">
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => {
              setKeyword('');
              setCategoryFilter('');
              setOnSaleFilter('');
            }}>
              重置
            </button>
            <button type="button" className="admin-btn admin-btn--sm">查询</button>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div className="admin-card__title">数据列表</div>
          <button type="button" className="admin-btn admin-btn--sm" onClick={openAdd}>添加</button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>商品信息</th>
                <th>价格/货号</th>
                <th>标签</th>
                <th>库存/销量</th>
                <th>审核状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((g) => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>
                    <div className="admin-goods-info">
                      <ProductThumb product={g} className="admin-goods-thumb" />
                      <div>
                        <strong>{g.name}</strong>
                        <small>{g.brand} · {getCategoryName(g.categoryId)}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>¥{g.price}</strong>
                    <small>{g.sku}</small>
                  </td>
                  <td>
                    <div className="admin-tags">
                      <label className="admin-toggle" title={GOODS_TAG_HELP.onSale}>
                        <input type="checkbox" checked={g.onSale} onChange={async () => {
                          try { await good.toggleField(g.id, 'onSale'); bump(); }
                          catch (err) { toast(err.message || '操作失败', 'error'); }
                        }} />
                        <span className="admin-toggle__slider" />
                        <span className="admin-toggle__label">上架</span>
                      </label>
                      <label className="admin-toggle" title={GOODS_TAG_HELP.isNew}>
                        <input type="checkbox" checked={g.isNew} onChange={async () => {
                          try { await good.toggleField(g.id, 'isNew'); bump(); }
                          catch (err) { toast(err.message || '操作失败', 'error'); }
                        }} />
                        <span className="admin-toggle__slider" />
                        <span className="admin-toggle__label">新品</span>
                      </label>
                      <label className="admin-toggle" title={GOODS_TAG_HELP.isRecommended}>
                        <input type="checkbox" checked={g.isRecommended} onChange={async () => {
                          try { await good.toggleField(g.id, 'isRecommended'); bump(); }
                          catch (err) { toast(err.message || '操作失败', 'error'); }
                        }} />
                        <span className="admin-toggle__slider" />
                        <span className="admin-toggle__label">推荐</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <span>{g.stock}</span>
                    <small>销量 {g.sales}</small>
                  </td>
                  <td><span className="admin-badge">{g.auditStatus}</span></td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-link" onClick={() => openEdit(g)}>编辑</button>
                      <button type="button" className="admin-link admin-link--danger" onClick={() => setDeleteId(g.id)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={7} className="admin-table__empty">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal
        open={modalOpen}
        title={editing ? '编辑商品' : '添加商品'}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        footer={
          <>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setModalOpen(false)}>取消</button>
            <button type="button" className="admin-btn admin-btn--sm" onClick={handleSubmit}>确定</button>
          </>
        }
      >
        {formError && <p className="admin-error">{formError}</p>}
        <div className="admin-form-grid">
          <label className="admin-form-item">
            <span>商品名称</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>品牌</span>
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>价格</span>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>库存</span>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>货号 SKU</span>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </label>
          <label className="admin-form-item">
            <span>分类</span>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => (
                (c.children || []).length > 0 ? (
                  <optgroup key={c.id} label={c.name}>
                    {c.children.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </optgroup>
                ) : (
                  <option key={c.id} value={c.id}>{c.name}</option>
                )
              ))}
            </select>
          </label>
          <label className="admin-form-item admin-form-item--full">
            <span>规格</span>
            <input value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} />
          </label>
        </div>
        <div className="admin-form-hint">
          <p>标签说明：上架=前台可购买；新品=显示新品角标；推荐=进入首页推荐区</p>
        </div>
      </AdminModal>

      <AdminConfirm
        open={!!deleteTarget}
        message={`确定删除商品「${deleteTarget?.name ?? ''}」吗？`}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await good.deleteGood(deleteId);
            setDeleteId(null);
            bump();
          } catch (err) {
            toast(err.message || '删除失败', 'error');
          }
        }}
      />
    </>
  );
};

export default AdminGoodsPage;
