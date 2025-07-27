"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DownloadButton = ({
  data,
  prepareExportData,
  fileName = "data",
  disabled = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Download as Excel
  const downloadAsExcel = useCallback(async () => {
    if (!data || data.length === 0) {
      alert("No data to download");
      return;
    }

    setIsDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const XLSX = await import("xlsx");

      const exportData = prepareExportData ? prepareExportData() : data;

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = Object.keys(exportData[0]).map((key) => ({
        wch: Math.max(key.length, 15),
      }));
      ws["!cols"] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download file
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      alert("Error downloading file");
    } finally {
      setIsDownloading(false);
    }
  }, [data, prepareExportData, fileName]);

  // Download as PDF
  const downloadAsPDF = useCallback(async () => {
    if (!data || data.length === 0) {
      alert("No data to download");
      return;
    }

    setIsDownloading(true);
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const exportData = prepareExportData ? prepareExportData() : data;

      // Create PDF document in landscape orientation
      const doc = new jsPDF("landscape");

      // Add title
      doc.setFontSize(16);
      doc.text(
        `${fileName.charAt(0).toUpperCase() + fileName.slice(1)} Report`,
        14,
        22
      );

      // Add subtitle with date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

      // Add table
      autoTable(doc, {
        head: [Object.keys(exportData[0])],
        body: exportData.map((row) => Object.values(row)),
        startY: 40,
        styles: {
          fontSize: 7,
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40 },
        tableWidth: "auto",
        columnStyles: {
          // Auto-adjust column widths for better fit
          0: { cellWidth: "auto" },
          1: { cellWidth: "auto" },
          2: { cellWidth: "auto" },
          3: { cellWidth: "auto" },
          4: { cellWidth: "auto" },
          5: { cellWidth: "auto" },
          6: { cellWidth: "auto" },
          7: { cellWidth: "auto" },
          8: { cellWidth: "auto" },
          9: { cellWidth: "auto" },
          10: { cellWidth: "auto" },
          11: { cellWidth: "auto" },
        },
      });

      // Save the PDF
      doc.save(`${fileName}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF file:", error);
      alert("Error downloading file");
    } finally {
      setIsDownloading(false);
    }
  }, [data, prepareExportData, fileName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isDownloading || !data || data.length === 0}
          className="h-10"
        >
          <Icon
            icon={
              isDownloading
                ? "heroicons:arrow-path"
                : "heroicons:arrow-down-tray"
            }
            className={`w-4 h-4 mr-1 ${isDownloading ? "animate-spin" : ""}`}
          />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadAsExcel}>
          <Icon icon="heroicons:document-arrow-down" className="w-4 h-4 mr-2" />
          Download as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadAsPDF}>
          <Icon icon="heroicons:document-arrow-down" className="w-4 h-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
