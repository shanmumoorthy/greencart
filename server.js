require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const driversRoutes = require('./src/routes/drivers');
const routesRoutes = require('./src/routes/routesApi');
const ordersRoutes = require('./src/routes/orders');
const simRoutes = require('./src/routes/simulation');
const loader = require('./src/utils/loader');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/simulate', simRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true }));

// Connect and start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { })
  .then(async () => {
    console.log('Mongo connected');
    // optional: load CSVs if DB empty
    await loader.loadIfEmpty();
    app.listen(PORT, () => console.log(`Server running ${PORT}`));
  })
  .catch(err => console.error(err));
