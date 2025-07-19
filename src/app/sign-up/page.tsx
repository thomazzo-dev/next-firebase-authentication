"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import GithubIcon from "@/components/svg-icons/github-icons";
import GoogleIcon from "@/components/svg-icons/google-icons";
import Link from "next/link";
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

import { useFormState } from "react-dom";
import useAuth from "@/hooks/useAuth";

export default function SignUpPage() {
  const { socialLogin } = useAuth();
  const githubProvider = new GithubAuthProvider();
  const googleAuthProvider = new GoogleAuthProvider();
  return (
    <section className="w-[496px] p-12 bg-white rounded-2xl inline-flex flex-col justify-center items-center gap-12">
      <header className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[50px] w-[120px] relative gap-2 p-2">
        <svg
          width={84}
          height={29}
          viewBox="0 0 84 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-[84px] h-7 relative"
          preserveAspectRatio="none"
        >
          <g clip-path="url(#clip0_2_614)">
            <mask
              id="mask0_2_614"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={20}
              height={28}
            >
              <path
                d="M-6.10352e-05 0.473572H19.9628V27.8821H-6.10352e-05V0.473572Z"
                fill="white"
              />
            </mask>
            <g mask="url(#mask0_2_614)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.9628 27.8797C18.2642 27.8797 16.7216 27.8911 15.1796 27.864C15.0049 27.8609 14.7976 27.6735 14.6663 27.5192C11.295 23.5556 7.93177 19.5847 4.56688 15.6155C4.458 15.4871 4.34546 15.3618 4.14422 15.1313V27.8415H-0.00012207V0.51179H4.10222V13.0493C4.32588 12.7965 4.44903 12.6697 4.55811 12.532C7.62309 8.66839 10.6899 4.80643 13.7437 0.934039C13.9983 0.611323 14.2534 0.465396 14.6758 0.473775C16.1016 0.502388 17.5282 0.484812 19.1122 0.484812C15.3703 5.03656 11.702 9.49878 8.01924 13.9786C11.9831 18.5923 15.9232 23.1781 19.9628 27.8797Z"
                fill="black"
              />
            </g>
            <mask
              id="mask1_2_614"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x={45}
              y={0}
              width={20}
              height={29}
            >
              <path
                d="M45.5725 0.551849H64.2666V28.1544H45.5725V0.551849Z"
                fill="white"
              />
            </mask>
            <g mask="url(#mask1_2_614)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M60.8295 18.403C60.8211 17.1379 60.623 16.1636 60.2115 15.2333C58.546 11.4672 53.75 10.6689 51.1006 13.7172C49.214 15.8879 48.9806 19.4543 50.5676 21.856C52.2181 24.3533 55.2486 25.1903 57.7356 23.771C59.8874 22.5431 60.7378 20.5478 60.8295 18.403ZM60.395 10.1783V0.551849H64.2666V27.9032C63.378 27.9032 62.4861 27.9132 61.5953 27.8889C61.5003 27.8862 61.3839 27.6953 61.3235 27.5696C61.0827 27.0673 60.8601 26.5559 60.6081 25.9973C59.4482 27.1298 58.0944 27.7338 56.5712 28.0074C52.0072 28.8274 47.5118 26.148 46.1668 21.697C45.046 17.9887 45.4426 14.4687 47.9389 11.3852C50.5136 8.20526 55.2186 7.20033 58.6842 9.02769C59.2728 9.33794 59.797 9.77184 60.395 10.1783Z"
                fill="black"
              />
            </g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M80.0756 16.5911C80.0899 14.1049 77.6732 11.8933 74.9308 11.8485C72.1994 11.8039 69.8451 13.9614 69.7841 16.5911H80.0756ZM69.7625 19.8923C69.859 21.8486 71.4811 23.7371 73.4971 24.2401C75.6794 24.7845 77.5552 24.2607 79.0682 22.5482C79.1793 22.4225 79.3597 22.2819 79.5102 22.2792C80.7808 22.258 82.0522 22.267 83.3911 22.267C82.9008 23.5785 82.21 24.6926 81.273 25.6456C79.4829 27.4662 77.2638 28.1733 74.7599 28.1274C70.0757 28.0413 66.2727 24.5472 65.7054 19.8526C65.3801 17.1609 65.7193 14.6042 67.2199 12.3133C69.211 9.27332 72.074 7.82958 75.6849 8.21463C79.2405 8.59355 81.66 10.642 83.0301 13.9044C83.7995 15.736 84.0927 17.6621 83.6703 19.6474C83.6566 19.7116 83.6329 19.7735 83.5973 19.8923H69.7625Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M44.1252 27.8861H40.2415V27.2953C40.2404 23.7025 40.2533 20.1097 40.2327 16.5171C40.2215 14.5303 38.8249 12.6486 36.9909 12.0598C34.3339 11.2067 31.4353 13.0216 30.968 15.841C30.9044 16.225 30.8814 16.6199 30.8805 17.0098C30.874 20.4152 30.8767 23.8208 30.8767 27.2262V27.8726H27.0184V8.37458C27.8969 8.37458 28.774 8.36273 29.6499 8.38991C29.759 8.39339 29.8958 8.58857 29.9612 8.72346C30.2043 9.22317 30.4226 9.73453 30.6679 10.2804C32.5954 8.45531 34.8816 7.94171 37.3596 8.21558C40.5742 8.57099 43.2616 11.1264 43.8963 14.365C44.0427 15.1114 44.1297 15.8817 44.135 16.6418C44.1595 20.2515 44.1464 23.8615 44.1458 27.4712C44.1458 27.5896 44.1344 27.7081 44.1252 27.8861Z"
              fill="black"
            />
            <mask
              id="mask2_2_614"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x={-1}
              y={0}
              width={85}
              height={29}
            >
              <path
                d="M-0.00012207 28.1544H83.864V0.473572H-0.00012207V28.1544Z"
                fill="white"
              />
            </mask>
            <g mask="url(#mask2_2_614)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.963 27.8856H24.8076V8.38818H20.963V27.8856Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.2701 2.92503C25.2668 4.23777 24.174 5.32343 22.8665 5.3128C21.5957 5.30259 20.4984 4.20854 20.4831 2.93709C20.4676 1.65788 21.5935 0.52214 22.8798 0.519066C24.1813 0.5156 25.2734 1.61496 25.2701 2.92503Z"
                fill="black"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_2_614">
              <rect
                width="84.0001"
                height={28}
                fill="white"
                transform="translate(-0.00012207 0.269196)"
              />
            </clipPath>
          </defs>
        </svg>
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
      <form className="self-stretch flex flex-col justify-center items-center gap-4">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          ////  errors={state?.fie//ldErrors.username}
          minLength={3}
          maxLength={10}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          //  errors={state?.fie//ldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          minLength={4}
          required
          //  errors={state?.fie//ldErrors.password}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          minLength={4}
          //  errors={state?.fie//ldErrors.confirm_password}
        />
      </form>
      {/* Submit button */}
      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        <div
          data-destructive="False"
          data-icon-only="False"
          data-leading-icon="False"
          data-size="Default"
          data-state="Default"
          data-trailing-icon="False"
          data-type="Primary"
          className="self-stretch px-4 py-3 bg-black rounded-lg inline-flex justify-center items-center gap-2.5"
        >
          <div className="text-center justify-start text-white text-base font-medium font-['Inter'] leading-normal">
            Create your account
          </div>
        </div>
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
