const generateReadableTitleByGroupName = (name) => {
  name = name.trim().replace("FSWEB", "");
  const part = name[0] == "P" ? " (Part Time) " : "";
  name = name[0] == "P" ? name.slice(1) : name;
  const monthName = Intl.DateTimeFormat("tr", { month: "long" }).format(
    new Date(name.substring(0, 2))
  );
  return `Fsweb ${name} - ${monthName}${part}`;
};

module.exports = {
  generateReadableTitleByGroupName,
};
