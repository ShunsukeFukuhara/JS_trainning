import fs from "fs/promises";

const checkEntry = async (path) => {
  try {
    const stats = await fs.lstat(path);
    if (stats.isFile()) {
      return "file";
    } else if (stats.isDirectory()) {
      return "directory";
    } else if (stats.isSymbolicLink()) {
      return "symbolic link";
    }
    // 以下はWindowsでは検証不可
    else if (stats.isBlockDevice()) {
      return "block device";
    } else if (stats.isCharacterDevice()) {
      return "character device";
    } else if (stats.isFIFO()) {
      return "FIFO";
    } else if (stats.isSocket()) {
      return "socket";
    }

    return "unknown";
  } catch (error) {
    if (error.code === "ENOENT") {
      return "not found";
    }
    throw error;
  }
};

(async () => {
  console.log(await checkEntry("ex07/index.js"));
  console.log(await checkEntry("ex07/"));
  console.log(await checkEntry("ex07/symlink"));
  console.log(await checkEntry("ex07/notfound"));
})();
