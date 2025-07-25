import { auth } from "@/lib/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";
import { prisma } from "@/lib/db";

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

// sync user with Prisma for Oauth authentication
async function syncUser(
  uid: string,
  email: string,
  decodedToken: DecodedIdToken
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  // If user does not exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || email,
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
  if(user) {
    console.log("User already exists in DB:", user.email);
    return true;
  } else {
    return false;
  }
  
}

async function createUser(
  uid: string,
  email: string,
  decodedToken: DecodedIdToken
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });
  user = await prisma.user.create({
    data: {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || email,
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

export {
  parseRequestBody,
  verifyAuthToken,
  checkUserExists,
  createUser,
  deleteUser,
  syncUser
};
