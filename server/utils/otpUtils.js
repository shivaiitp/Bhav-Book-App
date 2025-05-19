import crypto from "crypto";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
}

export function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
