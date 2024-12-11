import { atom, selector } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
});

export const isAuthenticatedSelector = selector({
  key: "isAuthenticatedSelector",
  get: ({ get }) => {
    const auth = get(authState);
    return auth?.isAuthenticated || false;
  },
});

export const userSelector = selector({
  key: "userSelector",
  get: ({ get }) => {
    const auth = get(authState);
    return auth?.user || null;
  },
});
