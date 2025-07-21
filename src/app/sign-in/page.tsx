"use client";

import SocialLogin from "@/components/social-login";
import GithubIcon from "@/components/svg-icons/github-icons";
import GoogleIcon from "@/components/svg-icons/google-icons";
import Link from "next/link";
import React from "react";
import useAuth from "@/hooks/useAuth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import Input from "@/components/input";
import HeadingIcon from "@/components/svg-icons/heading-icon";

export default function SignInPage() {
  const { socialLogin } = useAuth();
  const githubProvider = new GithubAuthProvider();
  const googleAuthProvider = new GoogleAuthProvider();

  return (
    <section className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[496px] relative gap-12 p-12 rounded-2xl bg-white">
      <header className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-[50px] w-full  ">
          <HeadingIcon />
        </div>
        <section className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-6">
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-[400px] text-2xl font-medium text-left text-[#0f0f0f]">
            Hey friend! Welcome back
          </p>
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-[400px] text-base text-left text-[#2b2b2b]">
            Enter your email and we'll send a sign in code.
          </p>
        </section>
      </header>
      <form className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-6">
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          minLength={4}
          required
        />

        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
          <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-3 rounded-lg bg-black">
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white">
              Get started
            </p>
          </div>
          <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#636363]">
            Or
          </p>
          <section className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            {/* Social Login Buttons */}
            <SocialLogin
              providerIcon={<GithubIcon />}
              buttonText={"sign in with github"}
              authAction={() => socialLogin(githubProvider)}
            />
            <SocialLogin
              providerIcon={<GoogleIcon />}
              buttonText={"sign in with google"}
              authAction={() => socialLogin(googleAuthProvider)}
            />
          </section>
        </div>
      </form>
      <Link href="sign-up">
        <p className="flex-grow-0 flex-shrink-0 text-base text-center text-[#2b2b2b]">
          <span className="flex-grow-0 flex-shrink-0 text-base text-center text-[#2b2b2b]">
            No account?
          </span>
          <span className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-[#2b2b2b]">
            Create one
          </span>
        </p>
      </Link>
      <footer className="flex justify-center items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-10">
        <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#2b2b2b]">
          <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#2b2b2b]">
            By continuing, you agree to our
          </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#2b2b2b]">
            Terms
          </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#2b2b2b]">
            and
          </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#2b2b2b]">
            Privacy Policy.
          </span>
        </p>
      </footer>
    </section>
  );
}
