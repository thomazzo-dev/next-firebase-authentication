 import { DecodedIdToken } from "firebase-admin/auth";
 import { prisma } from "@/lib/db";
 
// sync user with Prisma for Oauth authentication
async function syncUser(
  uid: string,
  decodedToken: DecodedIdToken,
  email?: string
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  // If user does not exist, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: `${email ? decodedToken.email : email}`,
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
  if (user) {
    console.log("User already exists in DB:", user.email);
    return true;
  } else {
    return false;
  }
}

async function createUser(
  uid: string,
  decodedToken: DecodedIdToken,
  email?: string
) {
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });
  user = await prisma.user.create({
    data: {
      firebaseUid: decodedToken.uid,
      email: `${email ? decodedToken.email : email}`,
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

export { checkUserExists, createUser, deleteUser, syncUser };
