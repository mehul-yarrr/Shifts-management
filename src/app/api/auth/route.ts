import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/lib/models/User';
import { validateLogin, validateRegister } from '@/utils/validate';
import { generateToken } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'login') {
      const { email, password } = validateLogin(data);
      
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const token = generateToken({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const response = NextResponse.json({
        message: 'Login successful',
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    if (action === 'register') {
      const { email, password, name, role } = validateRegister(data);
      
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        role,
      });

      const token = generateToken({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const response = NextResponse.json({
        message: 'Registration successful',
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({ message: 'Logout successful' });
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Auth error:', error);
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      const errorMessages = error.errors.map((e: any) => e.message).join(', ');
      return NextResponse.json(
        { error: 'Validation error', details: errorMessages },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message === 'Unauthorized' || error.message === 'Forbidden' ? 401 : 500 }
    );
  }
}

