import { deleteSessionCookie } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Handle session cookie creation
    await deleteSessionCookie();

    // Return a successful response with user information
    return NextResponse.json(
      {
        message: "Sign-out successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign-out process:", error);

    // Handle specific error cases
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Return a generic error response
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
