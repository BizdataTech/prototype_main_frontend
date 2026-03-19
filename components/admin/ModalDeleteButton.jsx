const { Spinner } = require("phosphor-react");

const ModalDeleteButton = ({ loading, dlt }) => {
  return (
    <button
      className={`hover:bg-neutral-100 w-full text-red-700 ${loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} py-2 px-8`}
      disabled={loading}
      onClick={dlt}
    >
      {loading ? (
        <div className="flex items-center justify-stretch gap-1">
          Deleting <Spinner className="w-[1.5rem] h-[1.5rem] animate-spin" />
        </div>
      ) : (
        "Delete"
      )}
    </button>
  );
};

export default ModalDeleteButton;
