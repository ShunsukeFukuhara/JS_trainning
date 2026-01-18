// LF → CR+LF に変換
export const convertLfToCrLf = (text) => text.replace(/(?<!\r)\n/g, "\r\n");
// CR+LF → LF に変換
export const convertCrLfToLf = (text) => text.replace(/\r\n/g, "\n");
