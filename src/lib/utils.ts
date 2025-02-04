import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.locale("vi");

export const formatDate = (dateString: string) => {
  dayjs.extend(relativeTime);
  return dayjs(dateString).fromNow();
};

export const isPositiveInteger = (value: string) => {
  return /^[1-9]\d*$/.test(value);
};

export const removeHTMLTags = (str: string) => {
  return str.replace(/<[^>]*>?/gm, "");
};

export const randomItemFromArray = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const store = {
  get: (key: string) => {
    return JSON.parse(localStorage.getItem(key) as string);
  },
  set: (key: string, value: string | number | object) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export const detachedText = (
  text: string,
  character: string,
  position: "start" | "end"
) => {
  return text.split(character)[position === "start" ? 0 : text.length - 1];
};
