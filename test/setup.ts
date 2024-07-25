import { LocalStorage } from "node-localstorage";
export default () => {
    if (typeof window === "undefined") {
        global.localStorage = new LocalStorage("./data");
    }
};
