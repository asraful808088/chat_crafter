import axios from "axios";

export default function getItemAlternative(){
    try {
        const data = { ...info };
    
        const response = await axios.post(
          `${window.location.protocol}//${window.location.host}/api/${info.of??"entities"}/add`,
          data
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
