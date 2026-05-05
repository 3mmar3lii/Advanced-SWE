
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Metric from '../backend/models/Metric.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const metricsData = [
  { name: 'Mon', value: 75, date: new Date('2026-04-19T23:46:08.115Z'), category: 'Performance', type: 'daily' },
  { name: 'Tue', value: 80, date: new Date('2026-04-20T23:46:08.115Z'), category: 'Performance', type: 'daily' },
  { name: 'Wed', value: 78, date: new Date('2026-04-21T23:46:08.115Z'), category: 'Performance', type: 'daily' },
  { name: 'Thu', value: 82, date: new Date('2026-04-22T23:46:08.115Z'), category: 'Performance', type: 'daily' },
  { name: 'Fri', value: 83, date: new Date('2026-04-23T22:46:08.143Z'), category: 'Performance', type: 'daily' },
  { name: 'Sat', value: 85, date: new Date('2026-04-24T22:46:08.143Z'), category: 'Performance', type: 'daily' },
  { name: 'Sun', value: 88, date: new Date('2026-04-25T22:46:08.143Z'), category: 'Performance', type: 'daily' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    await Metric.deleteMany({ category: 'Performance' });
    console.log('Cleared existing performance metrics');

    await Metric.insertMany(metricsData);
    console.log('Seeded metrics data');

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seed();
