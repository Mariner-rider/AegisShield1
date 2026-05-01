import { parsePlatformEnv } from "../../../packages/config/src";

const env = parsePlatformEnv(process.env);
export const apiBoot = { name: "aegis-api", mode: env.AEGIS_MODE };
