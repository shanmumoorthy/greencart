const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

async function loadIfEmpty() {
  // ===== Load Drivers =====
  const cntDrivers = await Driver.countDocuments();
  if (cntDrivers === 0) {
    const csv = fs.readFileSync(path.join(__dirname, '../../data/drivers.csv'));
    const rows = parse(csv, { columns: true, skip_empty_lines: true });

    for (const r of rows) {
      const past7 = (r.past_week_hours || '').split('|').map(x => Number(x || 0));

      await new Driver({
        name: (r.name || '').trim(),
        currentShiftHours: Number(r.shift_hours || 0),
        past7daysHours: past7
      }).save();
    }
    console.log('✅ Drivers loaded');
  }

  // ===== Load Routes =====
  const cntRoutes = await Route.countDocuments();
  if (cntRoutes === 0) {
    const csv = fs.readFileSync(path.join(__dirname, '../../data/routes.csv'));
    const rows = parse(csv, { columns: true, skip_empty_lines: true });

    for (const r of rows) {
      await new Route({
        routeId: Number(r.route_id || 0),
        distanceKm: Number(r.distance_km || 0),
        trafficLevel: (r.traffic_level || 'Medium').trim(),
        baseTimeMinutes: Number(r.base_time_min || 0)
      }).save();
    }
    console.log('✅ Routes loaded');
  }

  // ===== Load Orders =====
  const cntOrders = await Order.countDocuments();
  if (cntOrders === 0) {
    const csv = fs.readFileSync(path.join(__dirname, '../../data/orders.csv'));
    const rows = parse(csv, { columns: true, skip_empty_lines: true });

    for (const r of rows) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const deliveryDateTime = new Date(`${today}T${(r.delivery_time || '00:00')}:00`);

      await new Order({
        orderId: Number(r.order_id || 0),
        valueRs: Number(r.value_rs || 0),
        assignedRoute: Number(r.route_id || 0),
        deliveryTimestamp: deliveryDateTime
      }).save();
    }
    console.log('✅ Orders loaded');
  }
}

module.exports = { loadIfEmpty };
