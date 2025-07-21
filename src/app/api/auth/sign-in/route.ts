import { NextResponse } from "next/server";
import { parseRequestBody, verifyAuthToken, syncUserWithPrisma } from "@/services/authServices";

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
