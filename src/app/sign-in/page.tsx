"use client";
import { useForm } from "react-hook-form";

import SocialLogin from "@/components/social-login";
import GithubIcon from "@/components/svg-icons/github-icons";
import GoogleIcon from "@/components/svg-icons/google-icons";
import Link from "next/link";
import React from "react";
import useAuth from "@/hooks/useAuth";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import Input from "@/components/input";
import HeadingIcon from "@/components/svg-icons/heading-icon";

type FormInput = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const { socialLogin, signInWithEmailPw } = useAuth();
  const githubProvider = new GithubAuthProvider();
  const googleAuthProvider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>();

 
  const onSubmit = () => signInWithEmailPw(watch("email"), watch("password"));

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
            Enter your email and we&apos;ll send a sign in code.
          </p>
        </section>
      </header>
      <form
        className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          {...register("email", { required: true })}
          errorMessage={errors.email?.message}
        />
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: true,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          errorMessage={errors.password?.message}
          placeholder="Enter your password"
        />

        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
          <button
            className="btn w-full bg-black text-white font-medium rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors capitalize"
            type="submit"
          >
            sign in
          </button>
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
