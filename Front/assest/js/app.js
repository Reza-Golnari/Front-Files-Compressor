const $ = document;

const browseBtn = $.querySelector(".browse-btn");
const fileInput = $.querySelector(".file-input");
const uploadBox = $.querySelector(".main__upload-box__container");
const haveFileBox = $.querySelector(".have-file");
const noFileBox = $.querySelector(".no-file");

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

uploadBox.addEventListener("dragleave", (event) => {
  uploadBox.classList.remove("dragover");
});
