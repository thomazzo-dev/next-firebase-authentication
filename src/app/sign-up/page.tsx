"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import GithubIcon from "@/components/svg-icons/github-icons";
import GoogleIcon from "@/components/svg-icons/google-icons";
import Link from "next/link";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import useAuth from "@/hooks/useAuth";
import SubmitButton from "@/components/submit-button";
import HeadingIcon from "@/components/svg-icons/heading-icon";

type FormInput = {
  email: string;
  password: string;
  checkPassword: string;
};

export default function SignUpPage() {
  const { socialLogin, signUpWithEmailPw } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>();
  const githubProvider = new GithubAuthProvider();
  const googleAuthProvider = new GoogleAuthProvider();

  const password = watch("password", ""); // Default value is empty string

  const onSubmit = () => signUpWithEmailPw(watch("email"), watch("password"));

  return (
    <section className="w-[496px] p-12 bg-white rounded-2xl inline-flex flex-col justify-center items-center gap-12">
      <header className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[50px] w-[120px] relative gap-2 p-2">
        <HeadingIcon />
      </header>
      <section className="self-stretch flex flex-col justify-start items-start gap-6">
        <p className="self-stretch justify-start text-stone-950 text-2xl font-medium font-['Inter'] leading-loose">
          Register
        </p>
        <p className="self-stretch justify-start text-zinc-800 text-base font-normal font-['Inter'] leading-normal">
          Get started today.
        </p>
      </section>
      {/* Input Fields */}
      <form
        className="self-stretch flex flex-col justify-center items-center gap-4"
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
        <Input
          id="checkPassword"
          type="password"
          {...register("checkPassword", {
            required: true,
            validate: (value) => value === password || "Passwords do not match", // Custom validation for matching passwords
          })}
          errorMessage={errors.checkPassword?.message}
          placeholder="Conform your password"
        />
        <SubmitButton />
      </form>
      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        {/* Divider */}
        <div className="justify-start text-stone-500 text-base font-normal font-['Inter'] leading-normal">
          Or
        </div>
        {/* Social Login Buttons */}
        <SocialLogin
          providerIcon={<GithubIcon />}
          buttonText={"continue with github"}
          authAction={() => socialLogin(githubProvider)}
        />
        <SocialLogin
          providerIcon={<GoogleIcon />}
          buttonText={"continue with google"}
          authAction={() => socialLogin(googleAuthProvider)}
        />
      </div>
      <Link href="/sign-in">
        <p className="text-center justify-start">
          <span className="text-zinc-800 text-base font-normal font-['Inter'] leading-normal">
            Already have an account?
          </span>
          <span className="text-zinc-800 text-base font-medium font-['Inter'] leading-normal">
            Sign in
          </span>
        </p>
      </Link>

      <footer className="self-stretch inline-flex justify-center items-start gap-10">
        <p className="text-center justify-start">
          <span className="text-zinc-800 text-sm font-normal font-['Inter'] leading-tight">
            By continuing, you agree to our
          </span>
          <span className="text-zinc-800 text-sm font-medium font-['Inter'] leading-tight">
            Terms
          </span>
          <span className="text-zinc-800 text-sm font-normal font-['Inter'] leading-tight">
            and
          </span>
          <span className="text-zinc-800 text-sm font-medium font-['Inter'] leading-tight">
            Privacy Policy.
          </span>
        </p>
      </footer>
    </section>
  );
}
