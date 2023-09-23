const $ = document;

const browseBtn = $.querySelector(".browse-btn");
const fileInput = $.querySelector(".file-input");
const uploadBox = $.querySelector(".main__upload-box__container");
const haveFileBox = $.querySelector(".have-file");
const noFileBox = $.querySelector(".no-file");
const uploadProgress = $.querySelector(".upload-progress");
const responseProgress = $.querySelector(".response-progress");
const downloadBtn = $.querySelector(".download-btn");
const iconArr = $.querySelectorAll(
  ".main__aside__body__step-container__box__icon"
);
const closeBtn = $.querySelector(".close-btn");
const modal = $.querySelector(".main__modal");
const fileNameElem = $.querySelector("#fileName");
const file2NameElem = $.querySelector("#file2Name");
const processTimeElam = $.querySelector("#processTime");
const inputSizeElam = $.querySelector("#inputSize");
const outputSizeElam = $.querySelector("#outputSize");
const ratioElam = $.querySelector("#ratio");
let mainFile, fileName, file2Name, processTime, inputSize, outputSize, ratio;

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
    sendFile(fileInput.files[0]);
    inputSize = fileInput.files[0].size;
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

  if (
    event.dataTransfer.files[0].type.includes("html") ||
    event.dataTransfer.files[0].type.includes("css") ||
    event.dataTransfer.files[0].type.includes("js") ||
    event.dataTransfer.files[0].type.includes("javascript")
  ) {
    sendFile(event.dataTransfer.files[0]);
    uploadBox.classList.remove("dragover");
    noFileBox.classList.add("hide-box");
    haveFileBox.classList.remove("hide-box");
    uploadBox.style.pointerEvents = "none";
    inputSize = event.dataTransfer.files[0].size;
  }
});

async function sendFile(file) {
  let formData = new FormData();
  formData.append("data_file", file);
  fileName = file.name;
  iconArr[0].classList.add("done");
  iconArr[0].parentElement.style.color = "#fff";
  uploadProgress.style.height = "100%";

  await axios
    .post("http://127.0.0.1:8000/compress", formData, {
      onUploadProgress: function (progressEvent) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        iconArr[1].classList.add("done");
        iconArr[1].parentElement.style.color = "#fff";
        responseProgress.style.height = progress + "%";
      },
    })
    .then(function (response) {
      mainFile = window.URL.createObjectURL(new Blob([response.data]));
      downloadBtn.href = mainFile;
      downloadBtn.setAttribute("download", fileName);
      downloadBtn.classList.add("show");
      modal.classList.add("active");
      outputSize = response.headers["content-length"];
      outputSizeElam.textContent = (outputSize / 1024).toFixed(2) + "KB";
      inputSizeElam.textContent = (inputSize / 1024).toFixed(2) + "KB";
      ratio = 100 - ((outputSize / inputSize) * 100).toFixed(1);
      ratioElam.textContent = ratio.toFixed(2) + "%";
    })
    .catch(function (error) {
      console.log(error);
    });
}

downloadBtn.addEventListener("click", () => {
  iconArr[2].classList.add("done");
  iconArr[2].parentElement.style.color = "#fff";
});

closeBtn.addEventListener("click", () => {
  reset();
});

function reset() {
  modal.classList.remove("active");
  downloadBtn.href = "";
  downloadBtn.download = "";
  uploadProgress.style.height = 0;
  responseProgress.style.height = 0;
  iconArr.forEach((icon) => {
    icon.classList.remove("done");
    icon.parentElement.style.color = "#717a8c";
  });
  noFileBox.classList.remove("hide-box");
  haveFileBox.classList.add("hide-box");
  uploadBox.style.pointerEvents = "all";
}
