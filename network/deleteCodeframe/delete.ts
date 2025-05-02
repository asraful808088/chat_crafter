import axios from "axios";

export default async function deleteCodeframe(info, callback) {
  try {
    const data = { ...info };

    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/deleteCodeframe/delete?name=${data.name}&of=${data.of}`,
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
