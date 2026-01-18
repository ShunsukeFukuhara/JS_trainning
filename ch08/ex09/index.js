// 解放処理の呼び出し忘れによるリソースのリークにを防ぐため、終了時に必ず close が呼ばれるようにする withResource 関数を書きなさい

export const withResource = (resource, process) => {
  try {
    process(resource);
  } finally {
    resource.close();
  }
};
