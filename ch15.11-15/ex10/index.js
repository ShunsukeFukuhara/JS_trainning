document.getElementById("image").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const img = new Image();
  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    img.src = e.target.result;
  });
  img.addEventListener("load", () => {
    const originalCanvas = document.getElementById("original");
    const filteredCanvas = document.getElementById("filtered");
    const originalCtx = originalCanvas.getContext("2d");
    const filteredCtx = filteredCanvas.getContext("2d");
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    filteredCanvas.width = img.width;
    filteredCanvas.height = img.height;
    originalCtx.drawImage(img, 0, 0);
    const imageData = originalCtx.getImageData(0, 0, img.width, img.height);
    const worker = new Worker("worker.js");

    worker.postMessage({
      imageData: imageData,
      width: img.width,
      height: img.height,
    });
    const loadingDiv = document.getElementById("loading");
    loadingDiv.style.display = "block";

    worker.onmessage = (e) => {
      const outputImageData = e.data;
      filteredCtx.putImageData(outputImageData, 0, 0);
      worker.terminate();

      loadingDiv.style.display = "none";
    };
  });
  reader.readAsDataURL(file);
});
