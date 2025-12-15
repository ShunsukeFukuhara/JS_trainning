const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const tokenInput = document.getElementById("tokenInput");
const successDiv = document.getElementById("success");
const failureDiv = document.getElementById("failure");

const FOLDER_PATH = "/js_training/";

const uploadFileToOneDrive = async (file, token) => {
  const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:${FOLDER_PATH}${file.name}:/content`;
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  const token = tokenInput?.value;
  if (!file || !token) {
    failureDiv.textContent = "ファイルとアクセストークンを入力してください。";
    return;
  }

  try {
    const response = await uploadFileToOneDrive(file, token);
    successDiv.textContent = `アップロード成功: ${response.name} (${response.size} バイト)`;
  } catch (error) {
    console.error("アップロードエラー:", error);
    failureDiv.textContent = `アップロード失敗`;
  }
});
