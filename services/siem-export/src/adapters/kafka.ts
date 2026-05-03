import { SiemEventV1 } from "../types";
export async function kafkaPublish(topic: string, batch: SiemEventV1[]): Promise<boolean> { return topic.length > 0 && batch.length >= 0; }
