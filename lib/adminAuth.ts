import crypto from "crypto";

export const adminCookieName = "casino_admin_auth";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function hasAdminPassword() {
  return getAdminPassword().length > 0;
}

export function createAdminToken() {
  const password = getAdminPassword();

  if (!password) {
    return "";
  }

  return crypto
    .createHmac("sha256", password)
    .update("casinogalaxy-admin")
    .digest("hex");
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword || !password) {
    return false;
  }

  const passwordBuffer = Buffer.from(password);
  const configuredPasswordBuffer = Buffer.from(configuredPassword);

  return (
    passwordBuffer.length === configuredPasswordBuffer.length &&
    crypto.timingSafeEqual(passwordBuffer, configuredPasswordBuffer)
  );
}

export function verifyAdminToken(token: string | undefined) {
  const expectedToken = createAdminToken();

  if (!expectedToken || !token) {
    return false;
  }

  const tokenBuffer = Buffer.from(token);
  const expectedTokenBuffer = Buffer.from(expectedToken);

  return (
    tokenBuffer.length === expectedTokenBuffer.length &&
    crypto.timingSafeEqual(tokenBuffer, expectedTokenBuffer)
  );
}
