const loadSheetJS = async () => {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error('Failed to load spreadsheet engine from CDN.'));
    document.head.appendChild(script);
  });
};

const safeCellText = (val) => {
  if (typeof val === 'string' && val.length > 32000) {
    return ""; // Exceeds Excel cell limit of 32767 characters
  }
  return val || "";
};

const convertInvoiceToAOA = (data) => {
  const aoa = [
    ["INVOY INVOICE SPREADSHEET"],
    ["Generated on", new Date().toLocaleDateString()],
    [],
    ["[INVOICE DETAILS]"],
    ["Invoice Number", data.invoiceMeta?.invoiceNumber || ""],
    ["Currency", data.invoiceMeta?.currency || ""],
    ["Date", data.invoiceMeta?.date || ""],
    ["Due Date", data.invoiceMeta?.dueDate || ""],
    ["Template", data.template || ""],
    ["Quantity Column Label", data.invoiceMeta?.quantityLabel || ""],
    ["Rate Column Label", data.invoiceMeta?.rateLabel || ""],
    [],
    ["[SENDER (YOUR BUSINESS)]"],
    ["Business Name", data.senderDetails?.businessName || ""],
    ["Owner / Your Name", data.senderDetails?.name || ""],
    ["Email", data.senderDetails?.email || ""],
    ["Phone", data.senderDetails?.phone || ""],
    ["Address", data.senderDetails?.address || ""],
    ["GSTIN", data.senderDetails?.gstin || ""],
    ["Udyam No", data.senderDetails?.udyamNo || ""],
    ["Logo Base64", safeCellText(data.senderDetails?.logo)],
    ["Signature Base64", safeCellText(data.senderDetails?.signature)],
    [],
    ["[CLIENT DETAILS]"],
    ["Client Name", data.clientDetails?.name || ""],
    ["Client Email", data.clientDetails?.email || ""],
    ["Client Address", data.clientDetails?.address || ""],
    ["Client State", data.clientDetails?.state || ""],
    [],
    ["[CONFIG & PAYMENT]"],
    ["Payment Mode", data.paymentDetails?.mode || ""],
    ["Payment Status", data.paymentDetails?.status || ""],
    ["Transaction ID", data.paymentDetails?.transactionId || ""],
    ["Discount Type", data.adjustments?.discountType || "percentage"],
    ["Discount Value", data.adjustments?.discountValue || ""],
    ["Show Signature", data.contentOptions?.showSignature ? "TRUE" : "FALSE"],
    ["Show Payment Details", data.contentOptions?.showPaymentDetails ? "TRUE" : "FALSE"],
    ["Show Declaration", data.contentOptions?.showDeclaration ? "TRUE" : "FALSE"],
    ["Declaration Text", data.declaration || ""],
    [],
    ["[TAXES & FEES]"],
    ["Tax/Fee Name", "Type (percentage/flat)", "Value"]
  ];

  if (data.taxes && data.taxes.length > 0) {
    data.taxes.forEach(t => {
      aoa.push([t.name || "", t.type || "percentage", t.value || ""]);
    });
  }

  aoa.push([]);
  aoa.push(["[LINE ITEMS]"]);
  aoa.push(["Item Description", "Quantity", "Rate", "Total"]);

  if (data.items && data.items.length > 0) {
    const itemStartIdx = aoa.length + 1; // row index in spreadsheet (1-indexed)
    data.items.forEach((i, index) => {
      const rowNum = itemStartIdx + index;
      aoa.push([
        i.description || "",
        Number(i.quantity) || 0,
        Number(i.rate) || 0,
        { f: `B${rowNum}*C${rowNum}`, v: (Number(i.quantity) || 0) * (Number(i.rate) || 0) }
      ]);
    });
  }

  return aoa;
};

export const exportPDF = async (element, invoiceNumber) => {
  if (!element) throw new Error('Preview element not found');
  
  let html2pdf = window.html2pdf;
  if (!html2pdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PDF engine.'));
      document.head.appendChild(script);
    });
    html2pdf = window.html2pdf;
  }
  if (!html2pdf) throw new Error('PDF engine not initialized.');

  const filename = `Invoy_${invoiceNumber || 'invoice'}.pdf`;
  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  };
  
  return html2pdf().from(element).set(opt).save();
};

export const exportExcel = async (data) => {
  const XLSX = await loadSheetJS();
  const filename = `Invoy_${data.invoiceMeta?.invoiceNumber || 'invoice'}.xlsx`;
  const aoa = convertInvoiceToAOA(data);
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
  XLSX.writeFile(workbook, filename);
  return filename;
};

export const exportCSV = async (data) => {
  const XLSX = await loadSheetJS();
  const filename = `Invoy_${data.invoiceMeta?.invoiceNumber || 'invoice'}.csv`;
  const aoa = convertInvoiceToAOA(data);
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return filename;
};

export const exportJSON = (data) => {
  const filename = `Invoy_${data.invoiceMeta?.invoiceNumber || 'invoice'}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return filename;
};

export const exportExcelTemplate = async () => {
  const XLSX = await loadSheetJS();
  const filename = "Invoy_Template.xlsx";
  
  const sampleData = {
    template: 'classic',
    invoiceMeta: {
      invoiceNumber: 'INV-2026-001',
      currency: '₹',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      quantityLabel: 'Qty',
      rateLabel: 'Rate'
    },
    senderDetails: {
      businessName: 'Your Business Name',
      name: 'Owner Name',
      email: 'you@email.com',
      phone: '',
      address: 'Your Address',
      gstin: '',
      udyamNo: ''
    },
    clientDetails: {
      name: 'Client Business Name',
      email: 'client@email.com',
      address: 'Client Address',
      state: ''
    },
    contentOptions: {
      showSignature: false,
      showPaymentDetails: false,
      showDeclaration: true
    },
    paymentDetails: {
      mode: 'Bank Transfer',
      status: 'Unpaid',
      transactionId: ''
    },
    adjustments: {
      discountType: 'percentage',
      discountValue: 0
    },
    declaration: 'Terms & conditions apply.',
    taxes: [
      { name: 'VAT', type: 'percentage', value: 18 }
    ],
    items: [
      { description: 'Item 1', quantity: 1, rate: 1000 },
      { description: 'Item 2', quantity: 5, rate: 500 }
    ]
  };
  
  const aoa = convertInvoiceToAOA(sampleData);
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Template");
  XLSX.writeFile(workbook, filename);
  return filename;
};

export const importFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && typeof parsed === 'object') {
            if (parsed.items || parsed.invoiceMeta || parsed.senderDetails) {
              resolve(parsed);
            } else {
              reject(new Error('Invalid JSON structure.'));
            }
          } else {
            reject(new Error('Failed to parse JSON.'));
          }
        } catch (err) {
          reject(new Error('Failed to read JSON file.'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed.'));
      reader.readAsText(file);
    } else if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      loadSheetJS()
        .then((XLSX) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const u8 = new Uint8Array(event.target.result);
              const workbook = XLSX.read(u8, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              
              const imported = {
                template: 'classic',
                invoiceMeta: {},
                senderDetails: {},
                clientDetails: {},
                contentOptions: {},
                paymentDetails: {},
                adjustments: {},
                declaration: '',
                taxes: [],
                items: []
              };
              
              let currentSection = '';
              rows.forEach(row => {
                if (!Array.isArray(row) || row.length === 0) return;
                const colA = row[0] !== undefined ? String(row[0]).trim() : '';
                const colB = row[1] !== undefined ? String(row[1]).trim() : '';
                const colC = row[2] !== undefined ? String(row[2]).trim() : '';
                
                if (colA.startsWith('[') && colA.endsWith(']')) {
                  currentSection = colA.toUpperCase();
                  return;
                }
                
                if (!colA || colA === 'Tax/Fee Name' || colA === 'Item Description') return;
                
                switch (currentSection) {
                  case '[INVOICE DETAILS]':
                    if (colA === 'Invoice Number') imported.invoiceMeta.invoiceNumber = colB;
                    if (colA === 'Currency') imported.invoiceMeta.currency = colB;
                    if (colA === 'Date') imported.invoiceMeta.date = colB;
                    if (colA === 'Due Date') imported.invoiceMeta.dueDate = colB;
                    if (colA === 'Template') imported.template = colB;
                    if (colA === 'Quantity Column Label') imported.invoiceMeta.quantityLabel = colB;
                    if (colA === 'Rate Column Label') imported.invoiceMeta.rateLabel = colB;
                    break;
                  case '[SENDER (YOUR BUSINESS)]':
                    if (colA === 'Business Name') imported.senderDetails.businessName = colB;
                    if (colA === 'Owner / Your Name') imported.senderDetails.name = colB;
                    if (colA === 'Email') imported.senderDetails.email = colB;
                    if (colA === 'Phone') imported.senderDetails.phone = colB;
                    if (colA === 'Address') imported.senderDetails.address = colB;
                    if (colA === 'GSTIN') imported.senderDetails.gstin = colB;
                    if (colA === 'Udyam No') imported.senderDetails.udyamNo = colB;
                    if (colA === 'Logo Base64') imported.senderDetails.logo = colB;
                    if (colA === 'Signature Base64') imported.senderDetails.signature = colB;
                    break;
                  case '[CLIENT DETAILS]':
                    if (colA === 'Client Name') imported.clientDetails.name = colB;
                    if (colA === 'Client Email') imported.clientDetails.email = colB;
                    if (colA === 'Client Address') imported.clientDetails.address = colB;
                    if (colA === 'Client State') imported.clientDetails.state = colB;
                    break;
                  case '[CONFIG & PAYMENT]':
                    if (colA === 'Payment Mode') imported.paymentDetails.mode = colB;
                    if (colA === 'Payment Status') imported.paymentDetails.status = colB;
                    if (colA === 'Transaction ID') imported.paymentDetails.transactionId = colB;
                    if (colA === 'Discount Type') imported.adjustments.discountType = colB;
                    if (colA === 'Discount Value') imported.adjustments.discountValue = Number(colB) || '';
                    if (colA === 'Show Signature') imported.contentOptions.showSignature = colB.toUpperCase() === 'TRUE';
                    if (colA === 'Show Payment Details') imported.contentOptions.showPaymentDetails = colB.toUpperCase() === 'TRUE';
                    if (colA === 'Show Declaration') imported.contentOptions.showDeclaration = colB.toUpperCase() === 'TRUE';
                    if (colA === 'Declaration Text') imported.declaration = colB;
                    break;
                  case '[TAXES & FEES]':
                    imported.taxes.push({
                      id: (Date.now() + Math.random()).toString(),
                      name: colA,
                      type: colB || 'percentage',
                      value: Number(colC) || 0
                    });
                    break;
                  case '[LINE ITEMS]':
                    imported.items.push({
                      id: Date.now() + Math.random(),
                      description: colA,
                      quantity: Number(colB) || 1,
                      rate: Number(colC) || 0
                    });
                    break;
                }
              });
              
              if (imported.items.length > 0 || Object.keys(imported.senderDetails).length > 0) {
                if (imported.items.length === 0) {
                  imported.items = [{ id: Date.now(), description: '', quantity: 1, rate: 0 }];
                }
                resolve(imported);
              } else {
                reject(new Error('Invalid spreadsheet structure.'));
              }
            } catch (err) {
              reject(new Error('Failed to parse sheet data.'));
            }
          };
          reader.onerror = () => reject(new Error('File reading failed.'));
          reader.readAsArrayBuffer(file);
        })
        .catch(reject);
    } else {
      reject(new Error('Unsupported file extension.'));
    }
  });
};
