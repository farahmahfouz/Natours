import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updatePassword' : 'http://127.0.0.1:3000/api/v1/users/updateUser';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    console.log(res)
    if(res.data.status === 'success') {
        showAlert('success', `${type.toUpperCase()} updating successfuly`)
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};