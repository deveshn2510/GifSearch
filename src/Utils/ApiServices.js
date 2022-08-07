import axios from "axios";

export const postSearchGIF = async (query, offset=0) => {
  const path = `https://api.giphy.com/v1/gifs/search?api_key=i52hKJzFQu7f2tXPP2IoKD3K1wckHiS5&q=${query}&limit=24&offset=${offset}&rating=g&lang=en`;
  const res = await axios.get(`${path}`);
  return res && res.data ? res.data : null;
};
