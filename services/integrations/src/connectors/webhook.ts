import { SocEvent } from "../types";

export async function sendGenericWebhook(endpoint: string, payload: SocEvent): Promise<boolean> {
  // stub for deterministic local tests
  return endpoint.startsWith("http");
}
