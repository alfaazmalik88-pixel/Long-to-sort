const title = "MY AWESOME TITLE";
const escapedTitle = title.replace(/'/g, "\\'").replace(/:/g, "\\:");
console.log(escapedTitle);
