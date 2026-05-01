import { SiemEventV1 } from "../types";
export async function httpPush(endpoint: string, batch: SiemEventV1[]): Promise<boolean> { return endpoint.startsWith("http") && batch.length >= 0; }
