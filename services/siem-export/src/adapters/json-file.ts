import { SiemEventV1 } from "../types";
export async function jsonFileExport(_path: string, batch: SiemEventV1[]): Promise<boolean> { return Array.isArray(batch); }
