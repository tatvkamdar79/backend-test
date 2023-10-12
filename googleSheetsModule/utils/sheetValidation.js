const ALLOWED_HEADERS = [
  "_id",
  "company",
  "category",
  "group",
  "modelNumber",
  "size",
  "color",
  "style",
  "material",
  "costPrice",
  "markUp",
  "mrp",
  "hsn",
  "additionalIdentifier",
  "additionalIdentifier2",
  "billingDescription",
  "UOM",
];

const MANDATORY_HEADERS = [
  "_id",
  "company",
  "category",
  "group",
  "modelNumber",
  "mrp",
  "hsn",
  "billingDescription",
  "UOM",
];

module.exports.validateSheetRowData = (sheetRows) => {
  const errors = [];

  if (!sheetRows) {
    errorMessage = "SHEET IS EMPTY";
    errors.push(errorMessage);
    return errors;
  }

  if (sheetRows.length === 0) {
    errors.push("No Rows Found");
    return errors;
  }

  const headers = sheetRows[0];
  const invalidHeaders = [];
  for (let header of headers) {
    if (!ALLOWED_HEADERS.includes(header)) {
      invalidHeaders.push(header);
    }
  }
  if (invalidHeaders.length > 0) {
    errorMessage = "Inavlid Headers Found - " + invalidHeaders.join(", ");
    errors.push(errorMessage);
    return errors;
  }

  const missingMandatoryHeaders = [];
  for (let mandatoryHeader of MANDATORY_HEADERS) {
    if (!headers.includes(mandatoryHeader))
      missingMandatoryHeaders.push(mandatoryHeader);
  }
  if (missingMandatoryHeaders.length > 0) {
    errorMessage =
      "Missing Mandatory Headers - " + missingMandatoryHeaders.join(", ");
    errors.push(errorMessage);
    return errors;
  }

  if (sheetRows.length === 1) {
    errors.push("No Product Data Available");
    return errors;
  }

  const invalidLengthRows = [];
  if (sheetRows.length > 1) {
    for (let i = 1; i < sheetRows.length; i++) {
      if (sheetRows[i].length !== headers.length) {
        invalidLengthRows.push(i + 1);
      }
    }
  }
  if (invalidLengthRows.length > 0) {
    errors.push("Invalid Rows Length", JSON.stringify(invalidLengthRows));
    return errors;
  }

  return errors;
};
