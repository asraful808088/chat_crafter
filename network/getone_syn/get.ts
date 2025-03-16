import axios from "axios";

export default async function getOneSynItem(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/getoneSyn/${data["id"]}?word=${data["word"]}`
    );
    if (callback) {
      callback(response.data);
    }
  } catch (error) {
    if (callback) {
      callback(null, error.response);
    }
  }
}
