export function validatePassword(password: string): boolean {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // getMonth() retorna 0-11
  const year = now.getFullYear();

  const calculatedPassword = 30676 * day * month + year;
  return password === calculatedPassword.toString();
}