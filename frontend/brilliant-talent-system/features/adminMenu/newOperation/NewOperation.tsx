import { FileUploadDashboard } from "./FileUploadDashboard";
import { OperationResultPage } from "./OperationResultPage";

export const NewOperation = () => {
  return (
    <div className="bg-background font-primary">
      <FileUploadDashboard />
      <OperationResultPage />
    </div>
  );
};

export default NewOperation;
