import { hashSecret } from "../src/auth/security";

const demoPassword = "ChangeMeNow!1234";
console.log("Seed demo password hash:", hashSecret(demoPassword));
