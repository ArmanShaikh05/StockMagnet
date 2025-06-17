// components/NoRecentInvoices.tsx
import { FileText } from "lucide-react";

export default function NoRecentInvoices() {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white  rounded-2xl shadow-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-main/10 p-4 rounded-full">
            <FileText className="h-8 w-8 text-main" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">No Recent Invoices</h2>
        <p className="text-sm text-gray-500 mt-2">
          You haven’t created any invoices recently. Start billing to see them here.
        </p>
      </div>
    </div>
  );
}
