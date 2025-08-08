"use client";

import { getAllPurchaseOrderDataOfBranch } from "@/actions/purchaseOrderActions";
import { Branches, Suppliers } from "@/lib/generated/prisma";
import { useBranchStore } from "@/store/branchStore";
import { SerializedPurchaseOrderDataType } from "@/types/serializedTypes";
import { useEffect, useMemo, useState } from "react";
import EmptyPurchaseOrder from "../empty/EmptyPurchaseOrder";
import TableLoading from "../loading/InventoryLoading";
import { columns } from "../tables/purchaseOrders/Column";
import FullPurchaseOrderTable from "../tables/purchaseOrders/FullPurchaseOrderTable";
import { Card, CardContent, CardHeader } from "../ui/card";
import PurchaseOrderTableHeader from "./PurchaseOrderTableHeader";

const PurchaseOrderTable = ({
  suppliersList,
  branchesList,
}: {
  suppliersList: Suppliers[];
  branchesList: Branches[];
}) => {
  const { selectedBranch } = useBranchStore();

  const [purchaseOrderData, setPurchaseOrderData] = useState<
    SerializedPurchaseOrderDataType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchString, setSearchString] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<string[]>([]);
  const [supplierFilter, setSupplierFilter] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (selectedBranch) {
        setLoading(true);
        const response: {
          success: boolean;
          message: string;
          data?: SerializedPurchaseOrderDataType[];
        } = await getAllPurchaseOrderDataOfBranch(selectedBranch.id);

        setPurchaseOrderData(response.data || []);
        setLoading(false);
      }
    })();
  }, [selectedBranch]);

  const filteredData = useMemo(() => {
    return purchaseOrderData.filter((invoice) => {
      const matchesSearch = searchString
        ? invoice.supplier.name
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.supplier.phone
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.supplier.state
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.supplier.gstNumber
            ?.toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.supplier.address
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          invoice.products.some((product) =>
            product.productName
              .toLowerCase()
              .includes(searchString.toLowerCase())
          )
        : true;

      const matchesBranch =
        branchFilter.length > 0
          ? branchFilter
              .map((item) => item.toLowerCase())
              .includes(invoice.branch.branchName.trim().toLowerCase())
          : true;

      const matchesSupplier =
        supplierFilter.length > 0
          ? supplierFilter
              .map((item) => item.toLowerCase())
              .includes(invoice.supplier.name.toString().toLowerCase())
          : true;

      const matchesPaymentMode =
        paymentFilter.length > 0
          ? paymentFilter
              .map((item) => item.toLowerCase())
              .includes(invoice.paymentStatus.trim().toLowerCase())
          : true;

      return (
        matchesSearch && matchesBranch && matchesSupplier && matchesPaymentMode
      );
    });
  }, [
    supplierFilter,
    purchaseOrderData,
    paymentFilter,
    searchString,
    branchFilter,
  ]);

  return (
    <Card className="shadow-lg">
      {loading ? (
        <CardContent>
          <TableLoading />
        </CardContent>
      ) : (
        <>
          <CardHeader className="-mb-4">
            {purchaseOrderData.length > 0 && (
              <PurchaseOrderTableHeader
                setSearchString={setSearchString}
                setBranchFilter={setBranchFilter}
                branchFilter={branchFilter}
                supplierFilter={supplierFilter}
                setSupplierFilter={setSupplierFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
                suppliersList={suppliersList}
                branchesList={branchesList}
              />
            )}
          </CardHeader>
          <CardContent>
            {purchaseOrderData.length > 0 ? (
              <FullPurchaseOrderTable columns={columns} data={filteredData} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyPurchaseOrder />
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default PurchaseOrderTable;
