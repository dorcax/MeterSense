import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExport } from "@/hooks/use-export";

interface ExportButtonProps {
  datasets: Record<string, any[]>;
  filename?: string;
  chartRefs: {
    barRef: React.RefObject<HTMLDivElement>;
    pieRef: React.RefObject<HTMLDivElement>;
    lineRef: React.RefObject<HTMLDivElement>;
  };
}

const ExportButton = ({ datasets, filename = "report", chartRefs }: ExportButtonProps) => {
  const { exportCSV, exportXLSX, exportJSON, exportPDF } = useExport();

  const mergeAllData = () => {
    const merged: any[] = [];

    Object.entries(datasets).forEach(([key, arr]) => {
      if (!arr || !arr.length) return;

      merged.push({ section: key.toUpperCase() });
      merged.push(...arr);
      merged.push({});
    });

    return merged;
  };

  const mergedData = mergeAllData();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          onClick={() => exportCSV({ mergedData }, `${filename}.csv`)}
        >
          Export as CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportXLSX(datasets, `${filename}.xlsx`)}
        >
          Export as XLSX
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportJSON(datasets, `${filename}.json`)}
        >
          Export as JSON
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => exportPDF(datasets, chartRefs, `${filename}.pdf`)}
        >
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
