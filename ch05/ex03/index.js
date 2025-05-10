// "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"のいずれかの文字列リテラルを受け取って、
// その月の日数が31であれば true、そうでなければ false を返すメソッドを書きなさい。
// if-else を使うバージョンと switch を使うバージョンの両方を作りなさい。

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const is31daysWithIfElse = (month) => {
  if (!months.includes(month)) {
    throw new Error("Invalid month");
  }

  if (
    month === "Jan" ||
    month === "Mar" ||
    month === "May" ||
    month === "Jul" ||
    month === "Aug" ||
    month === "Oct" ||
    month === "Dec"
  ) {
    return true;
  } else {
    return false;
  }
};

export const is31daysWithSwitch = (month) => {
  if (!months.includes(month)) {
    throw new Error("Invalid month");
  }

  switch (month) {
    case "Jan":
    case "Mar":
    case "May":
    case "Jul":
    case "Aug":
    case "Oct":
    case "Dec":
      return true;
    default:
      return false;
  }
};
