let initialState = false;

const getDarkmode = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DARKMODE":
      localStorage.setItem("darkMode", JSON.stringify(action.payload));
      return action.payload;

    default:
      return state;
  }
};

export default getDarkmode;
