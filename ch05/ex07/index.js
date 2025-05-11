function f() {
  try {
    return true;
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return false;
  }
}

console.log(f());
