const GOOGLE_DOWNLOADED_FILES = "GOOGLE_DOWNLOADED_FILES";

module.exports.doesLocalGoogleSheetCopyExist = (fileName) => {
  try {
    fs.accessSync(
      path.join(GOOGLE_DOWNLOADED_FILES, `${fileName}.csv`),
      fs.constants.F_OK
    );
    return true;
  } catch (err) {
    return false;
  }
};
