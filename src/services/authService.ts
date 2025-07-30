import { auth } from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

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

// Helper function to revoke refresh tokens
async function revokeRefreshToken(decodedToken: DecodedIdToken) {
  const { uid } = decodedToken;
  try {
    await auth.revokeRefreshTokens(uid);
    console.log(`Revoked refresh tokens for user: ${uid}`);
  } catch (error) {}
}

// Helper function to create and set session cookie
async function createSessionCookie(decodedToken: DecodedIdToken) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
  try {
    const sessionCookie = await auth.createSessionCookie(decodedToken.token, {
      expiresIn,
    });

    const response = NextResponse.json(
      { message: "sign in successful" },
      { status: 200 }
    );

    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error creating and setting session cookie:", error);
    // Return an error response if session creation fails
    return NextResponse.json(
      { message: "Failed to create session" },
      { status: 500 }
    );
  }
}

// Helper function to delete session cookie
async function deleteSessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value || "";

  try {
    // if session cookie is not found, return a message indicating already logged out
    if (!sessionCookie) {
      return NextResponse.json(
        { message: "already logged out." },
        { status: 200 }
      );
    }

    // Delete the session cookie by setting its maxAge to 0
    cookieStore.set("__session", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    const response = NextResponse.json(
      { message: "sign out successful" },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error deleting session cookie:", error);

    // Delete the session cookie by setting its maxAge to 0 even if an error occurs
    cookieStore.set("__session", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    if (
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "auth/session-cookie-revoked") ||
      (error as { code?: string }).code === "auth/session-cookie-expired"
    ) {
      return NextResponse.json(
        {
          message: "session has been expired.",
        },
        { status: 200 }
      );
    }
    // Return an error response if session deletion fails
    return NextResponse.json(
      { message: "Failed to delete session" },
      { status: 500 }
    );
  }
}

export { verifyAuthRequest, createSessionCookie, deleteSessionCookie };
