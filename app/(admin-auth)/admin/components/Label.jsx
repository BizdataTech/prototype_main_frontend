const Label = ({ title, error }) => {
  return (
    <div className="flex justify-between items-end">
      <div>{title}</div>
      {error && (
        <div className="text-[1.5rem] text-red-700">{error.message}</div>
      )}
    </div>
  );
};

export default Label;
