const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Driver = require('../models/Driver');
const RouteModel = require('../models/Route');
const Order = require('../models/Order');
const SimulationResult = require('../models/SimulationResult');

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

// POST /api/simulate/run
router.post('/run', auth, async (req, res) => {
  try {
    const { numberOfDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // Validation
    if(typeof numberOfDrivers !== 'number' || numberOfDrivers <= 0) {
      return res.status(400).json({ error: 'numberOfDrivers must be > 0' });
    }
    if(!routeStartTime || !/^\d{2}:\d{2}$/.test(routeStartTime)) {
      return res.status(400).json({ error: 'routeStartTime must be HH:MM' });
    }
    if(typeof maxHoursPerDriver !== 'number' || maxHoursPerDriver <= 0) {
      return res.status(400).json({ error: 'maxHoursPerDriver > 0' });
    }

    // Load drivers, routes, orders
    let drivers = await Driver.find();
    const routes = await RouteModel.find();
    let orders = await Order.find({ status: 'pending' }).sort({ deliveryTimestamp: 1 });

    if(numberOfDrivers > drivers.length) {
      return res.status(400).json({ error: 'numberOfDrivers exceeds available drivers' });
    }

    // choose first N drivers (simple allocation — could be improved)
    drivers = drivers.slice(0, numberOfDrivers);

    // Parse start time on today's date
    const [hh, mm] = routeStartTime.split(':').map(Number);
    const today = new Date();
    const startDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm);

    // Company rules constants
    const LATE_PENALTY = 50;
    const HIGH_VALUE_THRESHOLD = 1000;
    const HIGH_VALUE_BONUS_PCT = 0.10;
    const BASE_FUEL_PER_KM = 5;
    const HIGH_TRAFFIC_SURCHARGE_PER_KM = 2;

    // Simulation: simple round-robin assign orders to drivers in order, tracking driver hours and time
    const driverStates = drivers.map((d,i) => ({
      driver: d,
      availableFrom: new Date(startDateTime),
      hoursWorked: 0, // today's hours
      deliveries: []
    }));

    let totalProfit = 0;
    let onTimeCount = 0;
    let totalDeliveries = 0;
    const orderResults = [];

    // Helper to get route object by routeId
    const routeMap = {};
    for(const r of routes) routeMap[r.routeId] = r;

    // Iterate orders and assign
    let driverIndex = 0;
    for(const order of orders) {
      totalDeliveries++;
      const ds = driverStates[driverIndex % driverStates.length];
      driverIndex++;

      const route = routeMap[order.assignedRoute];
      if(!route) {
        // skip if route not found
        continue;
      }
      // Delivery time calculation:
      // baseTimeMinutes, plus traffic effect — assume traffic doesn't change time but might be considered later
      let baseTime = route.baseTimeMinutes; // in minutes

      // If driver had fatigue flag from past7days (if their last day >8 hours), reduce speed?
      // Implement rule 2: if driver works >8 hours in a day, their delivery speed decreases by 30% the next day.
      // We'll check driver.past7daysHours last element >8 => speed decreases by 30% (i.e., time increases by 30%)
      const lastDayHours = (ds.driver.past7daysHours && ds.driver.past7daysHours.slice(-1)[0]) || 0;
      if(lastDayHours > 8) {
        baseTime *= 1.30; // slower -> more minutes
      }

      // Now compute deliveredAt based on ds.availableFrom + baseTime
      const deliveredAt = addMinutes(ds.availableFrom, Math.ceil(baseTime));
      const allowedTime = route.baseTimeMinutes + 10; // minutes allowed (rule 1)
      const minutesTaken = (deliveredAt - ds.availableFrom) / 60000;

      // late?
      const isLate = minutesTaken > allowedTime;
      const penalty = isLate ? LATE_PENALTY : 0;
      const onTime = !isLate;
      if(onTime) onTimeCount++;

      // High value bonus
      const highValueBonus = (order.valueRs > HIGH_VALUE_THRESHOLD && onTime) ? (order.valueRs * HIGH_VALUE_BONUS_PCT) : 0;

      // Fuel cost
      let fuelCostPerKm = BASE_FUEL_PER_KM;
      if(route.trafficLevel === 'High') fuelCostPerKm += HIGH_TRAFFIC_SURCHARGE_PER_KM;
      const fuelCost = fuelCostPerKm * route.distanceKm;

      // Profit for this order
      const orderProfit = (order.valueRs + highValueBonus) - penalty - fuelCost;

      totalProfit += orderProfit;

      // Update driver state
      const minutesWorked = minutesTaken; // assume minutes worked equals travel minutes for that order
      ds.hoursWorked += minutesWorked / 60;
      ds.availableFrom = addMinutes(deliveredAt, 5); // 5 min buffer between orders
      ds.deliveries.push(order.orderId);

      // Update order in DB as delivered with metadata, but keep original deliveryTimestamp
      order.deliveredAt = deliveredAt;
      order.deliveredBy = ds.driver._id;
      order.status = 'delivered';
      await order.save(); // persist

      orderResults.push({
        orderId: order.orderId,
        deliveredAt,
        onTime,
        penalty,
        fuelCost,
        highValueBonus,
        orderProfit
      });
    }

    // Efficiency score
    const efficiency = totalDeliveries === 0 ? 0 : (onTimeCount / totalDeliveries) * 100;

    // Save simulation result
    const sim = new SimulationResult({
      inputs: { numberOfDrivers, routeStartTime, maxHoursPerDriver },
      results: {
        totalProfit,
        efficiency,
        totalDeliveries,
        onTimeCount,
        orderResults
      }
    });
    await sim.save();

    // Respond with structured KPI results
    res.json({
      totalProfit,
      efficiency,
      totalDeliveries,
      onTimeCount,
      orderCount: orderResults.length,
      orderResults
    });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  const sims = await require('../models/SimulationResult').find().sort({ timestamp: -1 }).limit(50);
  res.json(sims);
});

module.exports = router;
