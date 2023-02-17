export const DAYS_TEXT = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SESSIONS_TEXT = [
  "08:30 - 10:30",
  "11:00 - 13:00",
  "13:30 - 03:30",
  "04:00 - 06:00",
];

export const EMPTY_SCHEDULE = {
  group: "",
  totalHours: "0",
  schedule: [
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
  ],
};

export const DEFAULT_PROFILE_IMG =
  "https://firebasestorage.googleapis.com/v0/b/schedual-maker.appspot.com/o/default%2Fdefault-profile.png?alt=media&token=9a811eba-0f25-4b34-b7dd-1fe6009bb636";
export const DEFAULT_BANNER =
  "https://firebasestorage.googleapis.com/v0/b/schedual-maker.appspot.com/o/default%2Fdefault-banner.png?alt=media&token=31286441-a606-402d-b639-40453e3b5cd8";

// Colors.
export const PRIMARY_COL = "#3F72AF";
export const SECONDARY_COL = "#E0DEDE";
export const LIGHT_COL = "#F9F7F7";
export const DARK_COL = "#112D4E";
export const EVENT_COL = "#BAB8B8";

export const PROFILE_IMG_SIZE = 256;
export const BANNER_SIZE = 1200;

export const VERSION = "1.7.1";
export const ABOUT_APP = (
  <p>
    <b>Schedule Maker</b> is a Web App made with react.<br></br>This App helps
    with creating scheduals for The <b>OFPPT</b>.
  </p>
);
export const MY_EMAIL = "ayoub2000mazouz@gmail.com";
