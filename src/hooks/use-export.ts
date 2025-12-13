import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const useExport = () => {
  // ---------------------- CSV EXPORT ----------------------
  const exportCSV = (data: Record<string, any[]>, filename: string) => {
    const ws = XLSX.utils.json_to_sheet(
      Object.values(data).flat()
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, filename);
  };

  // ---------------------- XLSX EXPORT ----------------------
  const exportXLSX = (data: Record<string, any[]>, filename: string) => {
    const wb = XLSX.utils.book_new();

    Object.entries(data).forEach(([key, arr]) => {
      const ws = XLSX.utils.json_to_sheet(arr);
      XLSX.utils.book_append_sheet(wb, ws, key);
    });

    XLSX.writeFile(wb, filename);
  };

  // ---------------------- JSON EXPORT ----------------------
  const exportJSON = (data: Record<string, any[]>, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------- PDF EXPORT ----------------------
  const exportPDF = async (
    datasets: Record<string, any[]>,
    chartRefs: {
      barRef: React.RefObject<HTMLDivElement>;
      pieRef: React.RefObject<HTMLDivElement>;
      lineRef: React.RefObject<HTMLDivElement>;
    },
    filename = "export.pdf"
  ) => {
    const doc = new jsPDF();
    let y = 15;

    // --------- EXPORT TABLE SECTIONS ---------
    Object.entries(datasets).forEach(([key, arr], index) => {
      if (!arr || arr.length === 0) return;

      doc.setFontSize(14);
      doc.text(key.toUpperCase(), 14, y);
      y += 5;

      const columns = Object.keys(arr[0] || {});
      const rows = arr.map((obj) => Object.values(obj));

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: y,
      });

      y = (doc as any).lastAutoTable.finalY + 10;

      if (index < Object.keys(datasets).length - 1) {
        doc.addPage();
        y = 15;
      }
    });

    // --------- HELPERS TO CAPTURE CHART IMAGES ---------
    const addChartImage = async (chartRef: any, title: string) => {
      if (!chartRef?.current) return;

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 3,
      });

      const imgData = canvas.toDataURL("image/png");

      doc.addPage();
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.addImage(imgData, "PNG", 10, 30, 180, 110);
    };

    // --------- EXPORT CHARTS ---------
    await addChartImage(chartRefs.barRef, "Monthly Energy by Source");
    await addChartImage(chartRefs.pieRef, "Energy Source Distribution");
    await addChartImage(chartRefs.lineRef, "Monthly Cost Trend");

    doc.save(filename);
  };

  return {
    exportCSV,
    exportXLSX,
    exportJSON,
    exportPDF,
  };
};
