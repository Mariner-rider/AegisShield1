export const environments = ["all", "dev", "staging", "prod"] as const;
export type EnvironmentName = typeof environments[number];
export function switchEnvironment(current: EnvironmentName, next: EnvironmentName): EnvironmentName {
  return next || current;
}
