'use server';

import connectToDb from '../lib/db';
import User from '../models/User';
import Metric from '../models/Metric';



export async function loginAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  console.log('Login attempt for:', email);

  try {
    // 1. Connect to MongoDB
    await connectToDb();


    // 2. Find user in DB
    const user = await User.findOne({ email });
    
    if (user && user.password === password) { // Note: In production, use bcrypt to compare hashed passwords
      return {
        success: true,
        user: { email: user.email, role: user.role, name: user.name },
        message: 'Login successful'
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'A server error occurred. Please try again later.'
    };
  }
}


export async function signupAction(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const role = formData.get('role');

  console.log('Signup attempt:', { name, email, role });

  try {
     await connectToDb();
    
     const existingUser = await User.findOne({ email });
     if (existingUser) return { success: false, message: 'User already exists' };

     const newUser = await User.create({ name, email, password, role });

    return {
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: { name, email, role }
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: 'Failed to create account.'
    };
  }
}

export async function getMetricsAction() {
  try {
    await connectToDb();
    const metrics = await Metric.find({}).sort({ date: 1 });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(metrics))
    };
  } catch (error) {
    console.error('Fetch metrics error:', error);
    return {
      success: false,
      message: 'Failed to fetch metrics.'
    };
  }
}
