const ShimmerContainer = () => {
  return (
    <div className="w-full min-h-[90svh] bg-neutral-200 relative rounded-[1rem] overflow-x-hidden space-y-12 p-6">
      <div className="flex justify-between">
        <div className="relative w-[40%] h-[5rem] bg-neutral-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent  a-shimmer-animation"></div>
        </div>
        <div className="relative w-[10%] h-[4rem] bg-neutral-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent  a-shimmer-animation"></div>
        </div>
      </div>
      <div className="space-y-4">
        {Array(5)
          .fill(undefined)
          .map((_, i) => (
            <div
              key={i}
              className={`relative w-full first:h-[3rem] h-[12rem] bg-neutral-300 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent  a-shimmer-animation"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShimmerContainer;
