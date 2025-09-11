import { FileUploadDashboard } from "./FileUploadDashboard";
import { OperationResultPage } from "./OperationResultPage";

export const NewOperation = () => {
  return (
    <div className="bg-background font-primary w-full mt-4">
      <FileUploadDashboard />
      {/* <OperationResultPage /> */}
    </div>
  );
};

export default NewOperation;
