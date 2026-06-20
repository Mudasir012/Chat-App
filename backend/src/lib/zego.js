import crypto from "crypto";

/**
 * Generate a ZegoUIKitPrebuilt test kit token server-side.
 * Mirrors the client-side ZegoUIKitPrebuilt.generateKitTokenForTest logic
 * so the server secret never ships to the browser.
 *
 * @param {number} appID
 * @param {string} serverSecret
 * @param {string} roomID
 * @param {string} userID
 * @param {string} userName
 * @param {number} [expire=7200] seconds
 */
export const generateKitTokenForTest = (
  appID,
  serverSecret,
  roomID,
  userID,
  userName,
  expire = 7200
) => {
  if (!userID) throw new Error("userID is required");
  if (!userName) throw new Error("userName is required");
  if (!appID || typeof appID !== "number") throw new Error("appID must be a number");
  if (!serverSecret) throw new Error("serverSecret is required");

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    app_id: appID,
    user_id: userID,
    nonce: Math.floor(2147483647 * Math.random()),
    ctime: now,
    expire: now + expire,
  };

  const key = Buffer.from(serverSecret, "utf8");
  const keyLength = key.length;

  let algorithm;
  if (keyLength === 16) algorithm = "aes-128-cbc";
  else if (keyLength === 24) algorithm = "aes-192-cbc";
  else if (keyLength === 32) algorithm = "aes-256-cbc";
  else
    throw new Error(
      `Unsupported serverSecret length: ${keyLength}. Must be 16, 24, or 32 bytes.`
    );

  let ivStr = Math.random().toString().substring(2, 18);
  if (ivStr.length < 16) ivStr += ivStr.substring(0, 16 - ivStr.length);
  const iv = Buffer.from(ivStr, "utf8");

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);

  const C = Buffer.allocUnsafe(28 + encrypted.length);
  C.writeUInt32BE(0, 0);
  C.writeUInt32BE(payload.expire, 4);
  C[8] = ivStr.length >> 8;
  C[9] = ivStr.length - (C[8] << 8);
  C.write(ivStr, 10, "utf8");
  C[26] = encrypted.length >> 8;
  C[27] = encrypted.length - (C[26] << 8);
  encrypted.copy(C, 28);

  const tokenPart = C.toString("base64");
  const meta = Buffer.from(
    JSON.stringify({
      userID,
      roomID,
      userName: encodeURIComponent(userName),
      appID,
    }),
    "utf8"
  ).toString("base64");

  return `04${tokenPart}#${meta}`;
};
