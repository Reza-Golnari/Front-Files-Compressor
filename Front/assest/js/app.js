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
      console.log(response);
      let mainFile = window.URL.createObjectURL(new Blob([response.data]));
      downloadBtn.href = mainFile;
      downloadBtn.setAttribute("download", "vue.js");
      downloadBtn.classList.add("show");
    })
    .catch(function (error) {
      console.log(error);
    });
}

downloadBtn.addEventListener("click", () => {
  iconArr[2].classList.add("done");
  iconArr[2].parentElement.style.color = "#fff";
});
