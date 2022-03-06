import axios from "axios";
export const getAllProducts = async () => {
  const response = await axios.get("https://nextjs-study-25b70-default-rtdb.firebaseio.com/products.json");

  const tempData = [];
  const responseData = response.data;
  for (const key in responseData) {
    tempData.push(responseData[key]);
  }
  return tempData;
};
export const getDetailProduct = async (id) => {
  const allProducts = await getAllProducts();
  return allProducts.find((item) => item.id == id);
};
