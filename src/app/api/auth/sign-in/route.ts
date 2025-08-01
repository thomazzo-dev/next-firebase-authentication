import { createSessionCookie, verifyAuthRequest } from "@/services/authService";
import { NextResponse } from "next/server";


export const POST = verifyAuthRequest(async (_, decodedToken) => {
  try {
    const { email, uid } = decodedToken;
    await createSessionCookie(decodedToken);

    return NextResponse.json(
      {
        message: "Authentication successful",
        user: { uid, email: email },
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
