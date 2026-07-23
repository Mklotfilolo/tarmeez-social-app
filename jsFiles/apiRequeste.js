// varibles to getposts function 
let currentPage = 1;
let TotalPages;
async function getPosts() {
  try {
    let response = await axios.get(
      `https://tarmeezacademy.com/api/v1/posts?page=${currentPage}&limit=8`,
    );
    if (response) {
      TotalPages = response.data.meta.last_page;
      currentPage = currentPage == TotalPages? 1 : ++currentPage;
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.message;
  }
}
// login and get token function
async function LoginUser(username, password) {
  try {
    let response = await axios.post("https://tarmeezacademy.com/api/v1/login", {
      username: username,
      password: password,
    });
    if (response) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data.message;
  }
}
async function registerNewUser(formdata) {
  try {
    let response = await axios.post(
      "https://tarmeezacademy.com/api/v1/register",
      formdata,
    );
    if (response) {
      return response.data;
    }
  } catch (error) {
    throw error.response.data.message;
  }
}
// create new post request
async function createNewPost(prams) {
  const token = localStorage.getItem("token");
  try {
    let response = await axios.post(
      "https://tarmeezacademy.com/api/v1/posts",
      prams,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
