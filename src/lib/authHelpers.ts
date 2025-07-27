import { auth } from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

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

async function verifyAuthRequest(request: Request) {
  const authorizationHeader = request.headers.get("Authorization");

  // Check if the authorization header is present and starts with 'Bearer'
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return {
      response: NextResponse.json(
        { message: "No ID token provided" },
        { status: 401 }
      ),
    };
  }

  const idToken = authorizationHeader.split("Bearer ")[1];

  // 2. parse the request body
  /*
  request.json() can only be called once, you must clone the request object 
  before parsing it in the HOF so the original handler can still access the body.
  */
  const bodyParseResult = await parseRequestBody(request.clone());

  if (bodyParseResult.error) {
    return {
      response: NextResponse.json(
        { message: bodyParseResult.error },
        { status: bodyParseResult.status }
      ),
    };
  }
  const {
    data: { firebaseUid },
  } = bodyParseResult;

  // Verify the ID token
  const tokenResult = await verifyAuthToken(idToken);
  if (tokenResult.error) {
    return {
      response: NextResponse.json(
        { message: tokenResult.error },
        { status: tokenResult.status }
      ),
    };
  }
  const { data: decodedToken } = tokenResult;

  // 4.  Ensure decodedToken is defined 
  
  if (!decodedToken) {
    return NextResponse.json(
      { message: "Invalid token data" },
      { status: 400 }
    );
  }

  // 5. Check for UID mismatch
  if (decodedToken.uid !== firebaseUid) {
    return {
      response: NextResponse.json({ message: "UID mismatch" }, { status: 401 }),
    };
  }

  // if all check is passed return decodedToken
  return { decodedToken };
}

// sync user with Prisma for Oauth authentication
async function syncUser(
  uid: string,
  decodedToken: DecodedIdToken,
  email?: string,
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  // If user does not exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email:`${email ? decodedToken.email : email}`,
        name: decodedToken.name || null,
      },
    });
    console.log("New user created in DB:", user.email);
  } else {
    // If user already exist
    if (user.email !== decodedToken.email) {
      user = await prisma.user.update({
        where: { firebaseUid: decodedToken.uid },
        data: { email: decodedToken.email },
      });
      console.log("User email updated in DB:", user.email);
    }
  }
}

async function checkUserExists(uid: string) {
  const user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });
  if (user) {
    console.log("User already exists in DB:", user.email);
    return true;
  } else {
    return false;
  }
}

async function createUser(
  uid: string,
  decodedToken: DecodedIdToken,
  email?: string
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });
  user = await prisma.user.create({
    data: {
      firebaseUid: decodedToken.uid,
      email: `${email ? decodedToken.email : email}`,
      name: decodedToken.name || null,
    },
  });

  console.log("New user created in DB:", user.email);
}

async function deleteUser(uid: string) {
  try {
    await prisma.user.delete({
      where: { firebaseUid: uid },
    });
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export { verifyAuthRequest, checkUserExists, createUser, deleteUser, syncUser };
