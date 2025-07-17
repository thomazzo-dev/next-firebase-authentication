import React, { ReactElement } from "react";

export default function SocialLogin({
  providerIcon,
  buttonText,
  authAction,
}: {
  providerIcon: ReactElement;
  buttonText: string;
  authAction?: () => Promise<void>; // Add onClick event handler for the button.
}) {
  return (
    <button
      type="button"
      className="btn btn-neutral btn-outline justify-between w-full hover:bg-[#E2E2E2] group "
      onClick={authAction}
    >
      {providerIcon}
      <span className=" text-base font-medium text-center text-[#0f0f0f] group-hover:text-white capitalize ">
        {buttonText}
      </span>
      <div></div>
    </button>
  );
}
