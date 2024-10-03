import axios from 'axios';

export default function ({ $axios }, inject) {
  // You can set default configurations here
  // $axios.defaults.baseURL = 'https://your-api-base-url.com';
  inject('axios', $axios);
}
