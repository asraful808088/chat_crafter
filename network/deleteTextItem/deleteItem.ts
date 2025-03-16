import axios from "axios";

export default async function deleteMainItem(info, callback) {
  try {
    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/deleteMainItem/delete?delete=${info.sent}&of=${info.of}&item=${info.item}`
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
