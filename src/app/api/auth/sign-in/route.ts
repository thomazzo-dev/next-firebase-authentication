import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) { // Assuming this is within a POST handler
  try {
    const authorizationHeader = request.headers.get('Authorization');

    // Check if the authorization header is present and starts with 'Bearer'
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'No ID token provided' }, { status: 401 });
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    let email: string;
    let firebaseUid: string;

    try {
      // Assuming the request body contains a JSON object with email and firebaseUid
      const body = await request.json();
      email = body.email;
      firebaseUid = body.firebaseUid;

      // Basic validation for presence (optional but good practice)
      if (!email || !firebaseUid) {
        return NextResponse.json({ message: 'Missing email or firebaseUid in request body' }, { status: 400 });
      }

    } catch (jsonError) {
      console.error('Failed to parse request body or missing fields:', jsonError);
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    // Verify the ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (tokenError) {
      console.error('ID Token verification failed:', tokenError);
      return NextResponse.json({ message: 'Invalid or expired ID token' }, { status: 401 });
    }

    // Check for UID mismatch
    if (decodedToken.uid !== firebaseUid) {
      return NextResponse.json({ message: 'UID mismatch' }, { status: 401 });
    }

    console.log('User authenticated successfully:', decodedToken.uid);

    // If all checks pass, return a success response
    return NextResponse.json(
      { message: 'Authentication successful', user: { uid: decodedToken.uid, email: decodedToken.email } },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error during sign-in process:', error);
    // Be more specific with error messages if possible
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
       return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}