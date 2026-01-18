// 任意の文字列を引数にとり、
// その文字列が JSON としてパース出来る場合 {success: true, data: <パースしたデータ>}を返し、
// できない場合 {success: false, error: <エラー内容>} を返す関数を書きなさい

export const parseJson = (str) => {
  try {
    const data = JSON.parse(str);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
