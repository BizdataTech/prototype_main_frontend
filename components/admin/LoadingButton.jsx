"use client";

import { Spinner } from "phosphor-react";

const LoadingButton = ({ buttonText, loadingText, loadingStat }) => {
  return (
    <button
      className={`bg-black text-white py-5 font-medium rounded-[.8rem] mt-12 ${loadingStat ? "cursor-not-allowed opacity-70" : "cursor-pointer"} hover:bg-neutral-800 active:bg-black transition-colors`}
      type="submit"
      disabled={loadingStat}
    >
      {loadingStat ? (
        <div className="flex items-center justify-center gap-2">
          {loadingText}{" "}
          <Spinner className="w-[2rem] h-[2rem] animate-spin" weight="bold" />
        </div>
      ) : (
        <div>{buttonText}</div>
      )}
    </button>
  );
};

export default LoadingButton;
