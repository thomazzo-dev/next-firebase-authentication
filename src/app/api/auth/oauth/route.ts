import { createSessionCookie, verifyAuthRequest } from "@/services/authService";
import { syncUser } from "@/services/userService";
import { NextResponse } from "next/server";
 
export const POST = verifyAuthRequest(async (_, decodedToken) => {
  try {
    const { email, uid } = decodedToken;
    await syncUser(uid, decodedToken, email);
    await createSessionCookie(decodedToken);
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
});
