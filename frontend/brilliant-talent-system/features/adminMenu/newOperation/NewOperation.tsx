import { FileUploadDashboard } from "./FileUploadDashboard";
import { OperationResultPage } from "./OperationResultPage";
import "@/app/globals.css";

export const NewOperation = () => {
  return (
    <div className="bg-background font-primary w-full">
      <FileUploadDashboard />
      <OperationResultPage />
    </div>
  );
};

export default NewOperation;
