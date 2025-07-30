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
import { shortId } from "@/lib/usernameGenerator";
import { useUser } from "@/components/user-provider";
/**
 
  signInWithEmailAndPassword
  signOut
  social authentication
  deleteUser
  
  
 * to use uesRouter hook put all the logic inside a new custom hook
 */

export default function useAuth() {
  const router = useRouter();

  const { setIsLoading } = useUser();

  const signUpWithEmailPw = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: `user_${shortId}`,
      });

      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/sign-up", {
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
        console.log("sign up successful:", data);
        router.push("/sign-in"); // if sign up is successful, redirect to sign in page
      } else {
        const errorData = await response.json();
        console.error("Server login error:", errorData.message);
        alert(`가입 실패: ${errorData.message}`);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
        alert(`가입중 중 오류 발생: ${error.message}`);
      }
    }
  };

  const signInWithEmailPw = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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
        console.log("sign-in successful:", data);
        router.push("/"); // if sign up is successful, redirect to sign in page
      } else {
        const errorData = await response.json();
        console.error("Server login error:", errorData.message);
        alert(`로그인 실패: ${errorData.message}`);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
        alert(`가입중 중 오류 발생: ${error.message}`);
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

      const response = await fetch("/api/auth/oauth", {
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
    setIsLoading(true);
    try {
      await signOut(auth);
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Sign-out successful:", data);
        router.push("/sign-in"); // redirect to sign-in page after sign-out
      } else {
        const errorData = await response.json();
        console.error("Server sign-out error:", errorData.message);
        alert(`sign out failed: ${errorData.message}`);
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignOut,
    socialLogin,
    signUpWithEmailPw,
    signInWithEmailPw,
   };
}
