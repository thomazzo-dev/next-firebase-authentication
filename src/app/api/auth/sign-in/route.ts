import { NextResponse } from "next/server";
import { auth } from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import {prisma} from '@/lib/db'; 

 // Helper function to parse request body safely
async function parseRequestBody(request: Request) {
  try {
    const body = await request.json();
    if (!body.email || !body.firebaseUid) {
      return {
        error: "Missing email or firebaseUid in request body",
        status: 400,
      };
    }
    return { data: body };
  } catch (jsonError) {
    console.error("Failed to parse request body:", jsonError);
    return { error: "Invalid request body format", status: 400 };
  }
}

// Helper function to verify ID token safely
async function verifyAuthToken(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return { data: decodedToken };
  } catch (tokenError) {
    console.error("ID Token verification failed:", tokenError);
    return { error: "Invalid or expired ID token", status: 401 };
  }
}

// Helper function to syncronize user information with prisma
async function syncUserWithPrisma(uid: string, email: string, decodedToken: DecodedIdToken) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  // If user does not exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || email, 
        name: decodedToken.name || null,
      },
    });
    console.log('New user created in DB:', user.email);
  } else {  
  // If user already exist
    if (user.email !== decodedToken.email) {
      user = await prisma.user.update({
        where: { firebaseUid: decodedToken.uid },
        data: { email: decodedToken.email },
      });
      console.log('User email updated in DB:', user.email);
    }
  }
}


export async function POST(request: Request) {
  // Assuming this is within a POST handler
  try {
    const authorizationHeader = request.headers.get("Authorization");

    // Check if the authorization header is present and starts with 'Bearer'
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No ID token provided" },
        { status: 401 }
      );
    }

    const idToken = authorizationHeader.split("Bearer ")[1];

    // Parse the request body to get email and firebaseUid
    const bodyParseResult = await parseRequestBody(request);

    if (bodyParseResult.error) {
      return NextResponse.json(
        { message: bodyParseResult.error },
        { status: bodyParseResult.status }
      );
    }
    const {
      data: { email, firebaseUid },
    } = bodyParseResult;

    // Verify the ID token
    const tokenResult = await verifyAuthToken(idToken);

    if (tokenResult.error) {
      return NextResponse.json(
        { message: tokenResult.error },
        { status: tokenResult.status }
      );
    }
    const { data: decodedToken } = tokenResult;

    // Ensure decodedToken is defined
    if (!decodedToken) {
      return NextResponse.json(
        { message: "Invalid token data" },
        { status: 400 }
      );
    }

    // Check for UID mismatch
    if (decodedToken.uid !== firebaseUid) {
      return NextResponse.json({ message: "UID mismatch" }, { status: 401 });
    }

    console.log("User authenticated successfully:", decodedToken.uid);
    // If all checks pass, return a success response and Synchronize user information with Prisma
    await syncUserWithPrisma(firebaseUid, email, decodedToken);

    return NextResponse.json(
      {
        message: "Authentication successful",
        user: { uid: decodedToken.uid, email: decodedToken.email },
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error during sign-in process:", error);
    // Be more specific with error messages if possible
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: (error instanceof Error ? error.message : "Internal server error") },
      { status: 500 }
    );
  }
}
