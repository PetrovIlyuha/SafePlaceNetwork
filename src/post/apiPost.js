export const createPost = (userId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listPosts = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
