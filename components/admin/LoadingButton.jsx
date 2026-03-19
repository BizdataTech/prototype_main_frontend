"use client";

import { Spinner } from "phosphor-react";

const LoadingButton = ({ buttonText, loadingText, loading }) => {
  return (
    <button
      className={`bg-black text-[1.4rem] text-white py-4 font-medium rounded-[1rem] mt-8 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} hover:bg-neutral-800 active:bg-black transition-colors`}
      type="submit"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          {loadingText}{" "}
          <Spinner
            className="w-[1.8rem] h-[1.8rem] animate-spin"
            weight="bold"
          />
        </div>
      ) : (
        <div>{buttonText}</div>
      )}
    </button>
  );
};

export default LoadingButton;
