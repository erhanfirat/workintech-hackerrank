export function downloadFile(fileURL, fileName) {
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const getCleanTestName = (name) => name?.replace("[Workintech] - ", "");

export const getDateStringFromISO = (ISOStr) => {
  return (ISOStr || "").substring(0, (ISOStr || "").indexOf("T"));
};

export const getDateTimeStringFromISO = (ISOStr) => {
  const res = (ISOStr || "").replace("T", " ");
  return res.substring(0, res.indexOf("+"));
};
