import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();
  
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}