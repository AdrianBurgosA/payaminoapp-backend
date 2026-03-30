export class PasswordHelper {
  public createRawPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*';

    const required = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    const all = uppercase + lowercase + numbers + symbols;
    const rest = Array.from(
      { length: 8 },
      () => all[Math.floor(Math.random() * all.length)],
    );

    return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
  }
}
