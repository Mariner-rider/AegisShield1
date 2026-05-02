import { SamlConfigInput } from "../types";

export function validateSamlMetadata(input: SamlConfigInput): boolean {
  return input.metadataXml.includes("<EntityDescriptor") || input.metadataXml.includes("<md:EntityDescriptor");
}

export function parseSamlAttributes(attrs: Record<string, string>, roleAttr: string): string | undefined {
  return attrs[roleAttr];
}
