// 次の関数を実装しなさい。

// 特定の年と月(1-12)を数値の引数で受け取り、その月の日数を返す関数
export const daysInMonth = (year, month) => {
  if (month < 1 || month > 12) {
    throw new Error("月は1から12の間で指定してください");
  }

  if (year < 0) {
    throw new Error("年は0以上の整数で指定してください");
  }

  // 当該の月の最終日がすなわちその月の日数となる
  return new Date(year, month, 0).getDate();
};

// 期間の開始日と終了日を'YYYY-MM-DD'形式の日付で二つ引数で受け取り、その期間(開始日と終了日を含む)の土日以外の日数を返す関数
export const weekdaysInRange = (startDate, endDate) => {
  // 日付のフォーマットをチェック
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
    throw new Error("日付は'YYYY-MM-DD'形式で指定してください");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    throw new Error("開始日は終了日より前でなければなりません");
  }

  let count = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      // 0: 日曜日, 6: 土曜日
      count++;
    }
  }
  return count;
};

// 'YYYY-MM-DD'形式の日付とロケールを引数で受け取り、その日の曜日をロケールの形式の文字列で返す関数
export const getWeekday = (dateString, locale) => {
  // 日付のフォーマットをチェック
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    throw new Error("日付は'YYYY-MM-DD'形式で指定してください");
  }

  // ロケールのフォーマットをチェック
  if (typeof locale !== "string" || !locale) {
    throw new Error("ロケールは非空の文字列で指定してください");
  }

  const date = new Date(dateString);

  // 曜日をロケールに基づいて取得
  const options = { weekday: "long" };
  return date.toLocaleDateString(locale, options);
};

// ローカルのタイムゾーンにおいて先月 1 日 0 時 0 分 0 秒の Date オブジェクトを返す関数。
// ただし getMonth、setMonth は利用してはいけない。
export const getFirstDayOfLastMonth = () => {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // 今月1日を求めるには、日数だけ引く（今日の1日を使う場合）
  const firstDayOfThisMonth = new Date(
    now.getTime() - (now.getDate() - 1) * oneDay
  );

  // 1ミリ秒引くと先月の最終日
  const lastDayOfLastMonth = new Date(firstDayOfThisMonth.getTime() - 1);

  // 先月の1日 0:00:00 を返す
  return new Date(
    lastDayOfLastMonth.getFullYear(),
    0,
    1, // 1日
    0,
    0,
    0,
    0
  );
};
