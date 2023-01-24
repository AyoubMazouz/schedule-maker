export const DAYS_TEXT = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Tursday",
    "Friday",
    "Saturday",
];

export const SESSIONS_TEXT = [
    "08:30 - 10:30",
    "11:00 - 13:00",
    "13:30 - 03:30",
    "04:00 - 06:00",
];

export const PROFS = [
    "Semmar",
    "Lahlali",
    "Aouid",
    "Diouri",
    "Zouita",
    "Boudi",
    "Idrissi",
    "Boukal",
    "Berrada",
    "Massif",
    "Harmouchi",
    "Legdani",
    "Aziz Sbai",
    "Aalil",
    "Belhaous",
    "Fathallah",
    "Zahraoui",
    "Belaoud",
];

export const ROOMS = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "21",
    "22",
    "24",
    "25",
    "26",
    "27",
    "28",
    "Teams",
];

export const EMPTY_SCHEDUAL = {
    id: 0,
    group: "",
    totalHours: 0,
    schedual: [
        [
            ["", "", "", null],
            ["", "", "", null],
            ["", "", "", null],
            ["", "", "", null],
        ],
        [
            ["", "", "", null],
            ["", "", "", null],
            ["", "", "", null],
            ["", "", "", null],
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

// Colors.
export const PRIMARY_COL = "#DA0037";
export const SECONDARY_COL = "#eee";
export const LIGHT_COL = "#EDEDED";
export const DARK_COL = "#171717";
export const EVENT_COL = "#FFEDD5";

export const DOMAIN_NAME = "https://schedual-maker.netlify.app";
export const VERSION = "0.4.7";
export const ABOUT_APP = (
    <p>
        <b>Schedual Maker</b> is a Web App made with react.<br></br>This App
        helps with creating scheduals for The <b>OFPPT</b>.
    </p>
);
export const MY_EMAIL = "ayoub2000mazouz@gmail.com";
