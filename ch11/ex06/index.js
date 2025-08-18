// 与えられた文字列がメールアドレスであるかチェックする関数isEmailAddressを実装しなさい。
// ただし RFC5322 に準拠したメールアドレスの判定は難しいので、与えられたテストコードが通ればよいものとする。

export const isEmailAddress = (email) => {
  if (typeof email !== "string") return false;

  // 許可する文字セット（ローカル部とドメイン部で共通）
  // A-Z, a-z, 0-9, 特殊文字 !#$%&'*+-/=?^_`{|}~
  const allowedChars = "[A-Za-z0-9!#$%&'*+\\-/=?^_`{|}~]";

  // 連続するドットを禁止するための否定先読み
  const noDoubleDot = "(?!.*\\.\\.)";

  // ローカル部のパターン
  // ローカル部は、許可された文字が1回以上続き、オプションでドットと許可された文字が続く
  const localPart = `${allowedChars}+(\\.${allowedChars}+)*`;

  // ドメイン部のパターン
  // ドメイン部は、許可された文字が1回以上続き、オプションでドットと許可された文字が続く
  const domainPart = `${allowedChars}+(\\.${allowedChars}+)*`;

  // 全体を組み合わせて正規表現を生成
  const re = new RegExp(`^${noDoubleDot}${localPart}@${domainPart}$`);

  if (!re.test(email)) return false;

  const [local, domain] = email.split("@");
  if (local.length > 64) return false;
  if (domain.length > 253) return false;
  if (email.length > 254) return false;

  // 先頭・末尾ドットやハイフン禁止
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.startsWith("-") || domain.endsWith("-")) return false;

  return true;
};
