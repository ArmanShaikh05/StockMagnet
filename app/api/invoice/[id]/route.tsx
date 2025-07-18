// app/api/invoice/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import InvoicePDF from "@/components/common/InvoicePDF";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const invoiceId = (await params).id;

  try {
    // const invoiceData = await getInvoiceData(invoiceId);

    const pdfStream = await renderToStream(<InvoicePDF />);

    return new NextResponse(pdfStream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceId}.pdf`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
}
