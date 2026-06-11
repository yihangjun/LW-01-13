import { useContext, useMemo, useState } from 'react';
import { ServiceContext } from '../../contexts/ServiceContext';
import { useToast } from '../../components/Toast';
import { ORDER_STATUS_TEXT } from '../../constants/orderStatus';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirm from '../../components/admin/AdminConfirm';
import './Admin.css';

const AdminOrdersPage = () => {
  const toast = useToast();
  const { order, admin } = useContext(ServiceContext);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [shipOrderId, setShipOrderId] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const hasPermission = admin.hasPermission('orders');

  const allOrders = useMemo(() => {
    return (order.getAllOrders() || []).filter((o) => o?.id);
  }, [order, refreshKey]);

  const list = useMemo(() => {
    return allOrders.filter((o) => {
      if (statusFilter !== '' && o.status !== Number(statusFilter)) return false;
      if (keyword) {
        const q = keyword.trim();
        if (!o.orderNo?.includes(q) && !o.userAccount?.includes(q)) return false;
      }
      return true;
    });
  }, [allOrders, keyword, statusFilter]);

  const detailOrder = detailOrderId
    ? allOrders.find((o) => o.id === detailOrderId)
    : null;
  const shipTarget = shipOrderId
    ? allOrders.find((o) => o.id === shipOrderId)
    : null;
  const deleteTarget = deleteOrderId
    ? allOrders.find((o) => o.id === deleteOrderId)
    : null;

  const bump = () => setRefreshKey((n) => n + 1);

  if (!hasPermission) {
    return <div className="admin-panel">无订单管理权限</div>;
  }

  const firstItem = detailOrder?.items?.[0];

  return (
    <>
      <section className="admin-card">
        <div className="admin-card__title">筛选搜索</div>
        <div className="admin-filter-grid">
          <label className="admin-form-item">
            <span>订单编号</span>
            <input placeholder="订单号/用户账号" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="admin-form-item">
            <span>订单状态</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">全部状态</option>
              {Object.entries(ORDER_STATUS_TEXT).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <div className="admin-filter-actions">
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => {
              setKeyword('');
              setStatusFilter('');
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
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>订单信息</th>
                <th>金额/支付</th>
                <th>来源/状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>
                    <strong>{o.orderNo}</strong>
                    <small>{o.createTime}</small>
                    <small>用户：{o.userAccount}</small>
                  </td>
                  <td>
                    <strong>¥{o.total}</strong>
                    <small>{o.payMethod || '未支付'}</small>
                  </td>
                  <td>
                    <span className="admin-badge">{ORDER_STATUS_TEXT[o.status]}</span>
                    <small>{o.source || 'APP'}</small>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-link" onClick={() => setDetailOrderId(o.id)}>查看订单</button>
                      {o.status === 1 && (
                        <button type="button" className="admin-link admin-link--primary" onClick={() => setShipOrderId(o.id)}>
                          订单发货
                        </button>
                      )}
                      <button type="button" className="admin-link admin-link--danger" onClick={() => setDeleteOrderId(o.id)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="admin-table__empty">暂无订单</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdminModal
        open={!!detailOrder}
        title="订单详情"
        onClose={() => setDetailOrderId(null)}
        footer={
          <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setDetailOrderId(null)}>关闭</button>
        }
      >
        {detailOrder && (
          <dl className="admin-detail-list">
            <div><dt>订单号</dt><dd>{detailOrder.orderNo}</dd></div>
            <div><dt>提交时间</dt><dd>{detailOrder.createTime}</dd></div>
            <div><dt>用户账号</dt><dd>{detailOrder.userAccount}</dd></div>
            <div><dt>订单金额</dt><dd>¥{detailOrder.total}</dd></div>
            <div><dt>支付方式</dt><dd>{detailOrder.payMethod || '未支付'}</dd></div>
            <div><dt>订单状态</dt><dd>{ORDER_STATUS_TEXT[detailOrder.status]}</dd></div>
            <div><dt>收货人</dt><dd>{detailOrder.address?.name} {detailOrder.address?.phone}</dd></div>
            <div><dt>收货地址</dt><dd>{detailOrder.address?.detail}</dd></div>
            <div><dt>商品</dt><dd>{firstItem?.name ?? '—'} × {firstItem?.count ?? 0}</dd></div>
          </dl>
        )}
      </AdminModal>

      <AdminConfirm
        open={!!shipTarget}
        title="订单发货"
        message={`确认对订单 ${shipTarget?.orderNo ?? ''} 执行发货操作？`}
        onCancel={() => setShipOrderId(null)}
        onConfirm={async () => {
          if (!shipOrderId) return;
          try {
            await order.shipOrder(shipOrderId);
            setShipOrderId(null);
            bump();
          } catch (err) {
            toast(err.message || '发货失败', 'error');
          }
        }}
      />

      <AdminConfirm
        open={!!deleteTarget}
        message={`确定删除订单 ${deleteTarget?.orderNo ?? ''} 吗？`}
        onCancel={() => setDeleteOrderId(null)}
        onConfirm={async () => {
          if (!deleteOrderId) return;
          try {
            await order.deleteOrder(deleteOrderId);
            setDeleteOrderId(null);
            bump();
          } catch (err) {
            toast(err.message || '删除失败', 'error');
          }
        }}
      />
    </>
  );
};

export default AdminOrdersPage;
