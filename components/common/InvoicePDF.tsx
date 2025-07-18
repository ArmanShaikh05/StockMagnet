
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  row: { flexDirection: 'row' },
  cell: {
    border: '1 solid #000',
    padding: 4,
    textAlign: 'center',
    flexGrow: 1,
  },
  bold: { fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  headerBox: {
    border: '1 solid #000',
    padding: 6,
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  tableRow: { flexDirection: 'row' },
  footer: {
    marginTop: 20,
    borderTop: '1 solid #000',
    paddingTop: 8,
    fontSize: 9,
    textAlign: 'center',
  },
  signatureBox: {
    marginTop: 10,
    alignItems: 'flex-end',
    fontSize: 10,
  },
});

const mockData = {
  invoiceNo: 'SHB/456/20',
  date: '20-Dec-20',
  seller: {
    name: 'Surabhi Hardwares, Bangalore',
    address: 'HSR Layout\nBangalore',
    gstin: '29AACCT3705E000',
    state: 'Karnataka',
    code: '29',
  },
  buyer: {
    name: 'Kiran Enterprises',
    address: '12th Cross',
    gstin: '29AAFFC8126N1ZZ',
    state: 'Karnataka',
    code: '29',
  },
  products: [
    {
      description: '12MM**',
      hsn: '1005',
      quantity: 7,
      rate: 500,
      per: 'No',
      discount: 0,
      amount: 3500,
      cgst: 315,
      sgst: 315,
    },
  ],
  total: 4130,
  taxSummary: {
    taxable: 3500,
    cgstRate: 9,
    cgstAmount: 315,
    sgstRate: 9,
    sgstAmount: 315,
    totalTax: 630,
  },
};

const InvoicePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 6 }}>
        TAX INVOICE
      </Text>

      {/* Seller Info */}
      <View style={styles.row}>
        <View style={{ flex: 2, border: '1 solid #000', padding: 6 }}>
          <Text style={styles.bold}>{mockData.seller.name}</Text>
          <Text>{mockData.seller.address}</Text>
          <Text>GSTIN/UIN: {mockData.seller.gstin}</Text>
          <Text>State Name: {mockData.seller.state}, Code : {mockData.seller.code}</Text>
        </View>

        <View style={{ flex: 1, border: '1 solid #000', padding: 6 }}>
          <Text>Invoice No.: {mockData.invoiceNo}</Text>
          <Text>Dated: {mockData.date}</Text>
        </View>
      </View>

      {/* Buyer Info */}
      <View style={styles.row}>
        <View style={{ flex: 1, border: '1 solid #000', padding: 6 }}>
          <Text>Consignee (Ship to):</Text>
          <Text>{mockData.buyer.name}</Text>
          <Text>{mockData.buyer.address}</Text>
          <Text>GSTIN/UIN: {mockData.buyer.gstin}</Text>
          <Text>State: {mockData.buyer.state}, Code: {mockData.buyer.code}</Text>
        </View>
        <View style={{ flex: 1, border: '1 solid #000', padding: 6 }}>
          <Text>Buyer (Bill to):</Text>
          <Text>{mockData.buyer.name}</Text>
          <Text>{mockData.buyer.address}</Text>
          <Text>GSTIN/UIN: {mockData.buyer.gstin}</Text>
          <Text>State: {mockData.buyer.state}, Code: {mockData.buyer.code}</Text>
        </View>
      </View>

      {/* Product Table Header */}
      <View style={styles.tableHeader}>
        {['Sl No.', 'Description of Goods', 'HSN/SAC', 'Qty', 'Rate', 'per', 'Disc %', 'Amount'].map((h, i) => (
          <Text key={i} style={styles.cell}>{h}</Text>
        ))}
      </View>

      {/* Product Table Row */}
      {mockData.products.map((p, i) => (
        <View key={i} style={styles.tableRow}>
          <Text style={styles.cell}>{i + 1}</Text>
          <Text style={styles.cell}>{p.description}</Text>
          <Text style={styles.cell}>{p.hsn}</Text>
          <Text style={styles.cell}>{p.quantity}</Text>
          <Text style={styles.cell}>{p.rate.toFixed(2)}</Text>
          <Text style={styles.cell}>{p.per}</Text>
          <Text style={styles.cell}>No</Text>
          <Text style={styles.cell}>{p.amount.toFixed(2)}</Text>
        </View>
      ))}

      {/* CGST & SGST */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
        <View style={{ width: '40%' }}>
          <Text style={{ textAlign: 'right' }}>CGST: ₹{mockData.products[0].cgst.toFixed(2)}</Text>
          <Text style={{ textAlign: 'right' }}>SGST: ₹{mockData.products[0].sgst.toFixed(2)}</Text>
          <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 11 }}>
            ₹ {mockData.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Amount in Words */}
      <Text style={{ marginTop: 10 }}>
        Amount Chargeable (in words): <Text style={{ fontWeight: 'bold' }}>Indian Rupee Four Thousand One Hundred Thirty Only</Text>
      </Text>

      {/* Tax Summary Table */}
      <View style={[styles.tableHeader, { marginTop: 10 }]}>
        {['HSN/SAC', 'Taxable Value', 'Central Tax Rate', 'Central Tax Amt', 'State Tax Rate', 'State Tax Amt', 'Total Tax'].map((h, i) => (
          <Text key={i} style={styles.cell}>{h}</Text>
        ))}
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.cell}>{mockData.products[0].hsn}</Text>
        <Text style={styles.cell}>{mockData.taxSummary.taxable.toFixed(2)}</Text>
        <Text style={styles.cell}>{mockData.taxSummary.cgstRate}%</Text>
        <Text style={styles.cell}>{mockData.taxSummary.cgstAmount.toFixed(2)}</Text>
        <Text style={styles.cell}>{mockData.taxSummary.sgstRate}%</Text>
        <Text style={styles.cell}>{mockData.taxSummary.sgstAmount.toFixed(2)}</Text>
        <Text style={styles.cell}>{mockData.taxSummary.totalTax.toFixed(2)}</Text>
      </View>

      {/* Tax Amount in Words */}
      <Text style={{ marginTop: 10 }}>
        Tax Amount (in words): <Text style={{ fontWeight: 'bold' }}>Indian Rupee Six Hundred Thirty Only</Text>
      </Text>

      {/* Declaration & Signature */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <Text style={{ fontSize: 9 }}>Declaration</Text>
          <Text>We declare that this invoice shows the actual price of the</Text>
          <Text>goods described and that all particulars are true and correct.</Text>
        </View>

        <View style={[styles.signatureBox, { flex: 1 }]}>
          <Text>for {mockData.seller.name}</Text>
          <Text style={{ marginTop: 30 }}>Authorised Signatory</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>This is a Computer Generated Invoice</Text>
    </Page>
  </Document>
);

export default InvoicePDF;
