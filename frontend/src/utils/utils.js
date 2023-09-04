export function downloadFile(fileURL, fileName) {
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
