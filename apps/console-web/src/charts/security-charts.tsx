import { useEffect, useMemo, useState } from "react";
import { AreaChart, BarChart, LineChart } from "@tremor/react";

export interface SecurityTelemetryPoint {
  timestamp: string;
  requests: number;
  blocked: number;
  protectionScore: number;
  attackTypes: Record<string, number>;
}

const initialTelemetry: SecurityTelemetryPoint[] = [];

export function useRealtimeSecurityTelemetry(socketUrl: string): SecurityTelemetryPoint[] {
  const [points, setPoints] = useState<SecurityTelemetryPoint[]>(initialTelemetry);

  useEffect(() => {
    const socket = new WebSocket(socketUrl);
    socket.onmessage = (event) => {
      const nextPoint = JSON.parse(event.data) as SecurityTelemetryPoint;
      setPoints((current) => [...current.slice(-119), nextPoint]);
    };
    return () => socket.close();
  }, [socketUrl]);

  return points;
}

export function RequestVolumeAreaChart({ telemetry }: { telemetry: SecurityTelemetryPoint[] }) {
  return <AreaChart data={telemetry} index="timestamp" categories={["requests"]} />;
}

export function AttackTypesBarChart({ telemetry }: { telemetry: SecurityTelemetryPoint[] }) {
  const distribution = useMemo(() => {
    const aggregate = telemetry.reduce<Record<string, number>>((acc, point) => {
      Object.entries(point.attackTypes).forEach(([key, value]) => {
        acc[key] = (acc[key] ?? 0) + value;
      });
      return acc;
    }, {});
    return Object.entries(aggregate).map(([type, count]) => ({ type, count }));
  }, [telemetry]);

  return <BarChart data={distribution} index="type" categories={["count"]} />;
}

export function ProtectionScoreLineChart({ telemetry }: { telemetry: SecurityTelemetryPoint[] }) {
  return <LineChart data={telemetry} index="timestamp" categories={["protectionScore"]} />;
}

export function buildDrillDownTooltip(point: SecurityTelemetryPoint): string {
  return `At ${point.timestamp}: ${point.requests} requests, ${point.blocked} blocked, protection ${point.protectionScore}`;
}

export async function exportChart(chartElement: SVGElement, format: "png" | "svg"): Promise<Blob> {
  if (format === "svg") {
    const svgMarkup = new XMLSerializer().serializeToString(chartElement);
    return new Blob([svgMarkup], { type: "image/svg+xml" });
  }

  const svgMarkup = new XMLSerializer().serializeToString(chartElement);
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = await createImageBitmap(svgBlob);
  const canvas = document.createElement("canvas");
  canvas.width = chartElement.viewBox.baseVal.width || 1200;
  canvas.height = chartElement.viewBox.baseVal.height || 420;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas context unavailable");
  context.drawImage(image, 0, 0);
  URL.revokeObjectURL(url);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))), "image/png");
  });
}
