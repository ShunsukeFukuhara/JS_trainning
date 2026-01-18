import fs from "fs";

fetch("http://localhost:8000/foo/bar/file.txt", {
  method: "PUT",
  body: fs.createReadStream("./ex10/file.txt"),
  duplex: "half",
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
