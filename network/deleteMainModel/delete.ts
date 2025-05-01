import axios from "axios";

export default async function deleteMainTrainEntitiesModel(info, callback) {
  try {
    const response = await axios.delete(
      `${window.location.protocol}//${window.location.host}/api/deleteMainModel/delete?of=${info.of}&item=${info.item}`
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
