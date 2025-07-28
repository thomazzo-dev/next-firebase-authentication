import { NextResponse } from "next/server";
import {
  verifyAuthRequest,
  createUser,
  checkUserExists,
} from "@/lib/authHelpers";
 

export async function POST (
  request: Request,
 ) {
  try {
    // 1. Verify the authentication request
    const authResult = await verifyAuthRequest(request);
 
    // Type guard to check if authResult contains a 'response' property
    if ("response" in authResult && authResult.response !== null && authResult.response !== undefined) {
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

    
    // If user already exists, throw an error
    const userExists = await checkUserExists(decodedToken.uid);
    if (!userExists) {
      await createUser(uid, decodedToken, email);
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
