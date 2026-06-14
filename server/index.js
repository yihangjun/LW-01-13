import express from 'express';
import cors from 'cors';
import goodsRouter from './routes/goods.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';
import cartsRouter from './routes/carts.js';
import { readDb } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'mall-api is running' });
});

app.use('/api/goods', goodsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/carts', cartsRouter);

app.use((err, _req, res) => {
  console.error(err);
  res.status(500).json({ ok: false, message: '服务器内部错误' });
});

app.listen(PORT, () => {
  readDb();
  console.log(`Mall API server running at http://localhost:${PORT}`);
});
