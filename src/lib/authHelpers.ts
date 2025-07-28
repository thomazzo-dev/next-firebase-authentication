import { auth } from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";

type AuthenticatedHandler<DecodedIdToken> = (
  request: NextRequest,
  decodedToken: DecodedIdToken
) => Promise<NextResponse>;

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

// HOF to verify authentication request
function verifyAuthRequest(handler: AuthenticatedHandler<DecodedIdToken>) {
  return async (request: NextRequest) => {
    const authorizationHeader = request.headers.get("Authorization");

    // Check if the authorization header is present and starts with 'Bearer'
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No ID token provided" },
        { status: 401 }
      );
    }
    const idToken = authorizationHeader.split("Bearer ")[1];

    // 2. parse the request body and verify the ID token by promise all
    const [bodyParseResult, tokenResult] = await Promise.all([
      parseRequestBody(request.clone()),
      verifyAuthToken(idToken),
    ]);

    // 3. error handling for body parsing
    if (bodyParseResult.error) {
      return NextResponse.json(
        { message: bodyParseResult.error },
        { status: bodyParseResult.status }
      );
    }
    const {
      data: { firebaseUid },
    } = bodyParseResult;

    // 4. error handling for token verification
    if (tokenResult.error) {
      return NextResponse.json(
        { message: tokenResult.error },
        { status: tokenResult.status }
      );
    }
    const { data: decodedToken } = tokenResult;

    // 5. verify decodedToken is defined and has the expected structure
    if (!decodedToken || decodedToken.uid !== firebaseUid) {
      return NextResponse.json({ message: "UID mismatch" }, { status: 401 });
    }

    // 6. if all check is passed, call the handler with decodedToken
    return handler(request, decodedToken as DecodedIdToken);
  };
}

// sync user with Prisma for Oauth authentication
async function syncUser(
  uid: string,
  decodedToken: DecodedIdToken,
  email?: string
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  // If user does not exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: `${email ? decodedToken.email : email}`,
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
