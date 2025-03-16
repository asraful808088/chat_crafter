import axios from "axios";

export default async function getScriptsItem(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.get(
      `${window.location.protocol}//${window.location.host}/api/get_scripts/${data["id"]}?of=${data["of"]}`
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
