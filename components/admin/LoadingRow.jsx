import { Spinner } from "phosphor-react";

const TableLoadingRow = () => {
  return (
    <div className="flex items-center justify-center py-4 gap-1 bg-neutral-100">
      Loading <Spinner className="w-[1.5rem] h-[1.5rem] animate-spin" />
    </div>
  );
};

export default TableLoadingRow;
