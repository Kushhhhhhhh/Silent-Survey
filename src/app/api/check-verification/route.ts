import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { dbConnect } from '@/lib/dbConnect';
import { UserModel } from '@/model/User';

export async function GET(request: NextRequest) {
    console.log('Received request to check verification status');

    try {
        await dbConnect();
        console.log('Database connection established');

        const session = await getServerSession(authOptions);
        console.log('Session retrieved:', session);

        if (!session || !session.user) {
            console.log('No active session found');
            return NextResponse.json({ success: false, message: 'No active session' }, { status: 401 });
        }

        const identifier = session.user.email || session.user.name;
        console.log('Checking verification status for user:', identifier);

        if (!identifier) {
            console.log('No identifier found in session');
            return NextResponse.json({ success: false, message: 'Invalid session data' }, { status: 400 });
        }

        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            console.log('User not found in database');
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        console.log('User verification status:', user.isVerified);

        if (user.isVerified) {
            return NextResponse.json({ success: true, verified: true, redirect: '/dashboard' });
        } else {
            return NextResponse.json({ success: true, verified: false, redirect: `/verify-${identifier}` });
        }

    } catch (error) {
        console.error('Error checking verification status:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}