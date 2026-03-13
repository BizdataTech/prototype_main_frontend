export const InputLabel = ({ label, error }) => {
  return (
    <div className="flex items-end justify-between">
      <div className="a-text--label">{label}</div>
      {error && <div className="a-text--error">{error}</div>}
    </div>
  );
};
