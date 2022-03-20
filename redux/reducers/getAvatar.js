let initialState = "";

const getAvatar = (state = initialState, action) => {
  switch (action.type) {
    case "GET_AVATAR":
      localStorage.setItem("avatarProfile", action.payload);
      return action.payload;

    default:
      return state;
  }
};

export default getAvatar;
