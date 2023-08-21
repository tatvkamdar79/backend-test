const axios = require("axios");

exports.scan = async (req, res) => {
  const { img } = req.body;
  const base64Data = img.replace(/^data:image\/jpeg;base64,/, "");
  console.log("sending request");
  try {
    const response = await axios.post("http://localhost:5000/decode_qr", {
      img: base64Data,
    });
    console.log(response.data);
    // const qrCodeDataList = response;
    res.json({ qr_data: response.data.qr_data });
  } catch (error) {
    console.log("Error calling Python server:", error.message);
    res.status(500).json({ message: "Error calling Python server" });
  }
};
