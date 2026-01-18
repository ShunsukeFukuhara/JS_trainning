// 挿入ソート以外のソート関数を実装しなさい。また実装したアルゴリズムの入力の配列長 n に対する時間計算量を O-記法で説明しなさい。

export const bubbleSort = (arr, compareFn = (a, b) => a - b) => {
  const newArr = [...arr];
  const n = newArr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (compareFn(newArr[j], newArr[j + 1]) > 0) {
        [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
      }
    }
  }
  return newArr;
};

export const mergeSort = (arr, compareFn = (a, b) => a - b) => {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);

  const merge = (left, right, compareFn) => {
    const result = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length) {
      if (compareFn(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  };

  return merge(left, right, compareFn);
};

export const quickSort = (arr, compareFn = (a, b) => a - b) => {
  const newArr = [...arr];
  if (newArr.length <= 1) return newArr;

  const pivot = newArr[Math.floor(newArr.length / 2)];
  const left = newArr.filter((item) => compareFn(item, pivot) < 0);
  const middle = newArr.filter((item) => compareFn(item, pivot) === 0);
  const right = newArr.filter((item) => compareFn(item, pivot) > 0);

  return [
    ...quickSort(left, compareFn),
    ...middle,
    ...quickSort(right, compareFn),
  ];
};
