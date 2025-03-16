import axios from "axios";

export default async function deleteGenItem(info, callback) {
  try {
    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/delete_gen/delete?delete=${info.sent}&of=${info.of}&gen=${info.gen}&item=${info.item}`
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
