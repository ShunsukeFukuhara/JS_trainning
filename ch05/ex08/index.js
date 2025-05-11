let x = 0;

for (let i = 1; i <= 5; i++) {
  x = i;
  try {
    throw Error();
  } catch {
    break;
    // eslint-disable-next-line no-unreachable
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    continue;
  }
}

console.log(x);
