import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
      const authorizationHeader = request.headers.get('Authorization');

      //check if the authorization header is present and starts with 'Bearer if not, return an error response'
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'No ID token provided' }, { status: 401 });
      }
    
      /* get firebase uid and email from the request body
        assuming the request body contains a JSON object with 
        email and firebaseUid */

      const idToken = authorizationHeader.split('Bearer ')[1];
      const { email, firebaseUid } = await request.json();
    

    // verify the id token
      const decodedToken = await auth.verifyIdToken(idToken);
      if (decodedToken.uid !== firebaseUid) {
        return NextResponse.json({ message: 'UID mismatch' }, { status: 401 });
      }

      console.log('User authenticated successfully:', decodedToken);
    }
    catch (error: any) {
        console.error('Error during login/sync:', error);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
      }
}