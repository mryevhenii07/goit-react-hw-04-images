import axios from "axios";
const BASE_URL = "https://pixabay.com/api";
const API_KEY = "25286524-a3e47886f4b5645396ef742cb";

const fetchImages = ({ searchQuery = "", currentPage = 1 }) => {
  const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${currentPage}&per_page=12&key=${API_KEY}`;

  return axios.get(url);
};

export default { fetchImages };
