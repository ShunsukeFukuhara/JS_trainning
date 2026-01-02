import fs from "fs";

const filePath = "./ex10/file.txt";

fs.open(filePath, "r", (err, fd) => {
  if (err) throw err;

  const stats = fs.statSync(filePath);
  const buffer = Buffer.alloc(stats.size);

  fs.read(fd, buffer, 0, buffer.length, 0, (err) => {
    if (err) throw err;

    fs.close(fd, () => {});

    fetch("http://localhost:8000/foo/bar/file.txt", {
      method: "PUT",
      body: buffer,
    })
      .then((res) => {
        console.log("status:", res.status);
        return res.text();
      })
      .then((text) => {
        console.log("response body:", text);
      })
      .catch((err) => {
        console.error("fetch error:", err);
      });
  });
});
