export function generateRandomId() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz_";

  const uuid = [];
  for (let i = 0; i < 32; i++) {
    uuid.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }

  return uuid.join("");
}
