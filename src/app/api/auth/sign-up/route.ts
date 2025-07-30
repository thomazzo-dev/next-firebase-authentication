import { verifyAuthRequest } from "@/services/authService";
import { checkUserExists, createUser } from "@/services/userService";
import { NextResponse } from "next/server";


export const POST = verifyAuthRequest(async (_, decodedToken) => {
  try {
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
    return NextResponse.json({
      message: "User created successfully",
      status: 201,
    });
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
