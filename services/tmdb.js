import axios from 'axios';


const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'daaaf1fbc930fa09a01032c6e26611e5', // Je API-sleutel
    language: 'en-US',
  },
});

export default tmdb;
