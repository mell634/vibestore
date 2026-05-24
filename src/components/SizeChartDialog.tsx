import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSizeChart } from "@/hooks/useProducts";
import { Ruler } from "lucide-react";

interface Props {
  gender?: string;
  type?: string;
}

export function SizeChartDialog({ gender, type }: Props) {
  const { data: chart } = useSizeChart(gender, type);

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-xs tracking-editorial uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent">
        <Ruler className="size-3.5" />
        Tabla de medidas
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">Guía de tallas</DialogTitle>
        </DialogHeader>
        {chart ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Medidas en {chart.chart.unit}. Mide sobre el cuerpo, no sobre la prenda.
            </p>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-foreground">
                    {chart.chart.columns.map((c) => (
                      <th key={c} className="text-left py-3 pr-4 text-[10px] tracking-editorial uppercase">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.chart.rows.map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      {row.map((cell, j) => (
                        <td key={j} className="py-3 pr-4 tabular-nums">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Si dudas entre dos tallas, te recomendamos elegir la mayor.
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No hay tabla disponible para esta categoría.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
