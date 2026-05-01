export function live() { return { status: "ok", ts: new Date().toISOString() }; }
export function ready(depsOk = true) { return { status: depsOk ? "ready" : "not_ready", ts: new Date().toISOString() }; }
