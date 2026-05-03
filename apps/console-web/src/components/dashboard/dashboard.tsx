"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Command } from "cmdk";
import { Toaster, toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AttackTable } from "./attack-table";
import { ResponsiveSidebar } from "./sidebar";
import { OnboardingWizard } from "./onboarding-wizard";

type Attack = { id: string; ts: string; type: string; severity: "low"|"medium"|"high"|"critical"; route: string };

export function Dashboard() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [theme, setTheme] = useState<"dark"|"light">("dark");

  useEffect(() => {
    const ws = new WebSocket("wss://example.invalid/attacks");
    ws.onmessage = (e) => { try { const attack = JSON.parse(e.data) as Attack; setAttacks((a) => [attack, ...a].slice(0,50)); toast("New attack detected", { description: `${attack.type} on ${attack.route}` }); } catch {} };
    return () => ws.close();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const chartData = useMemo(() => attacks.slice(0, 12).map((a, i) => ({ name: String(i+1), attacks: i + 4, requests: 100 + i * 12, score: 99 - i * 0.2 })), [attacks]);

  return <div className="md:flex min-h-screen"><ResponsiveSidebar /><main className="flex-1 p-4 md:p-8 space-y-6">
    <Toaster richColors position="top-right" />
    <header className="flex items-center justify-between"><h1 className="text-2xl font-bold">AegisShield Console</h1><Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle theme</Button></header>
    <Command className="rounded-lg border border-slate-700 p-3" aria-label="Global search command menu"><Command.Input placeholder="Search (Cmd+K)" className="w-full bg-transparent outline-none" /></Command>
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-slate-700 p-3 h-52"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Area dataKey="requests" stroke="#f97316" fill="#f97316" fillOpacity={0.2}/></AreaChart></ResponsiveContainer></div>
      <div className="rounded-lg border border-slate-700 p-3 h-52"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="attacks" fill="#06b6d4"/></BarChart></ResponsiveContainer></div>
      <div className="rounded-lg border border-slate-700 p-3 h-52"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><XAxis dataKey="name"/><YAxis/><Tooltip/><Line dataKey="score" stroke="#22c55e"/></LineChart></ResponsiveContainer></div>
    </section>
    <OnboardingWizard />
    <section aria-label="Real-time attacks feed" className="rounded-lg border border-slate-700 overflow-auto"><AttackTable data={attacks.map(a => ({ ts: a.ts, type: a.type, severity: a.severity, route: a.route }))} /></section>
  </main></div>;
}
