const $ = document;

const browseBtn = $.querySelector(".browse-btn");
const fileInput = $.querySelector(".file-input");
const uploadBox = $.querySelector(".main__upload-box__container");
const haveFileBox = $.querySelector(".have-file");
const noFileBox = $.querySelector(".no-file");
const uploadProgress = $.querySelector(".upload-progress");
const responseProgress = $.querySelector(".response-progress");
const downloadBtn = $.querySelector(".download-btn");

$.addEventListener("drop", (e) => {
  e.preventDefault();
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("input", () => {
  if (fileInput.files) {
    noFileBox.classList.add("hide-box");
    haveFileBox.classList.remove("hide-box");
    uploadBox.style.pointerEvents = "none";
  }
});

uploadBox.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadBox.classList.add("dragover");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("dragover");
});

uploadBox.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadBox.classList.remove("dragover");
  noFileBox.classList.add("hide-box");
  haveFileBox.classList.remove("hide-box");
  uploadBox.style.pointerEvents = "none";
  sendFile(event.dataTransfer.files[0]);
});

async function sendFile(file) {
  let formData = new FormData();
  formData.append("data_file", file);

  console.log(formData);
  console.log(file);
  await axios
    .post("http://127.0.0.1:8000/compress", formData, {
      onUploadProgress: function (progressEvent) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    })
    .then(function (response) {
      console.log(response);
      let mainFile = window.URL.createObjectURL(new Blob([response.data]));
      //   mainFile = mainFile.slice(5, -1);
      downloadBtn.href = mainFile;
      downloadBtn.setAttribute("download", "vue.js");
      downloadBtn.classList.add("show");
      console.log(mainFile);
      console.log(downloadBtn);
    })
    .catch(function (error) {
      console.log(error);
    });
}
