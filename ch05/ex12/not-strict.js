const nonStrict = () => {
  // strictモードで動作しない処理
  // eslint-disable-next-line no-undef
  a = 1;
  // eslint-disable-next-line no-undef
  console.log(a);
};

nonStrict();
