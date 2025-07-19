// client side authentication logics

import { FirebaseError } from "firebase/app";
import {
  AuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/**
 *
 * signInWithEmailAndPassword
 * signOut
 * signInWithGoogle
 * signInWithGithub
 * deleteUser
 * 
 * 
 * to use uesRouter hook put all the logic inside a new custom hook
 */

export default function useAuth() {
  
    const router = useRouter();

  const signUpWithEmailPw = async (
    email: string,
    password: string,
    userName: string
  ) => {
    try {
      const credentials = createUserWithEmailAndPassword(auth, email, password);
      await updateProfile((await credentials).user, {
        displayName: userName,
      });
      //navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  const signInWithEmailPw = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      //navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };
  

  const socialLogin = async (provider: AuthProvider) => {
    try {
      /* get the user credential from firebase auth
          and get the id token from the user credential
      */
      const userCredential = await signInWithPopup(auth, provider);

      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // send the id token in the authorization header
        },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        router.push("/"); // if login is successful, redirect to home page
      } else {
        const errorData = await response.json();
        console.error("Server login error:", errorData.message);
        alert(`로그인 실패: ${errorData.message}`);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
        alert(`로그인 중 오류 발생: ${error.message}`);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      //navigate("/auth/signin")
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  return { handleSignOut, socialLogin, signUpWithEmailPw, signInWithEmailPw };
}
