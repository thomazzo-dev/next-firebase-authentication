import { NextResponse } from "next/server";
import { verifyAuthRequest, syncUser } from "@/lib/authHelpers";

export async function POST(request: Request) {
  // Assuming this is within a POST handler
  try {
    // 1. Verify the authentication request
    const authResult = await verifyAuthRequest(request);

    // type guard for authResult ???
    if ("response" in authResult && authResult.response) {
      return authResult.response;
    }

    if (!("decodedToken" in authResult)) {
      return NextResponse.json(
        { message: "Decoded token is missing in authResult" },
        { status: 401 }
      );
    }

    const { decodedToken } = authResult;
    const { email, uid } = decodedToken;

    // If all checks pass, return a success response and Synchronize user information with Prisma
    await syncUser(uid, decodedToken, email);

    console.log("User authenticated successfully:", decodedToken.uid);

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
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
