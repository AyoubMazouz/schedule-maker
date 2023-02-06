import { Timestamp } from "firebase/firestore";

export const getRelativeDate = (timestamp: Timestamp) => {
  const formatter = new Intl.RelativeTimeFormat("en-US", {
    numeric: "always",
    style: "short",
  });

  const date = timestamp.toDate();

  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (mins < 1) return formatter.format(-secs, "seconds");
  if (hours < 1) return formatter.format(-mins, "minutes");
  if (days < 1) return formatter.format(-hours, "hours");
  if (months < 1) return formatter.format(-days, "day");
  if (years < 1) return formatter.format(-months, "month");
  return formatter.format(-years, "year");
};
