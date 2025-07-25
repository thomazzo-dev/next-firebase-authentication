import { NextResponse } from "next/server";
import { auth } from "@/lib/firebaseAdmin";
import {
  parseRequestBody,
  verifyAuthToken,
  createUser,
  checkUserExists,
} from "@/lib/authHelpers";

export async function POST(request: Request) {
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

    // If user already exists, throw an error
    const userExists = await checkUserExists(firebaseUid);
    if (!userExists) {
      await createUser(firebaseUid, email, decodedToken);
      console.log("User has been created successfully:", decodedToken);
    } else {
      console.log("User already exists:", decodedToken.uid);
      alert("User already exists");
    }
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
