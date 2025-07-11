'use server';

import bcrypt from 'bcryptjs';
import connectToDB from '@/lib/mongodb';
import User from '@/lib/models/user.model';

export async function signupUser(formData: FormData) {
  try {
    await connectToDB();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { ok: false, error: 'All fields are required.' };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { ok: false, error: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    return { ok: true };
  } catch (error) {
    console.error('Signup Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { ok: false, error: message };
  }
}


export async function loginUser(formData: FormData) {
  try {
    await connectToDB();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
     if (!email || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    const user = await User.findOne({ email }).lean();
    
    if (!user) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    if (!user.password) {
      console.error(`User with email ${email} has no password set.`);
      return { ok: false, error: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    // In a real app, you'd set a session cookie here.
    return { ok: true };
  } catch (error) {
    console.error('Login Error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { ok: false, error: message };
  }
}
