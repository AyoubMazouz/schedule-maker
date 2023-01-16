export type DataObj = {
    date: string;
    group: string;
    schedual: [];
}[];

export type OneDocument = {
    name: string;
    createdAt: any;
    modifiedAt: any;
    data: string;
};
export type DocumentsList = OneDocument[];

export const DAYS_TEXT = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Tursday",
    "Friday",
    "Saturday",
];

export const SESSIONS_TEXT = [
    "08:30-10:30",
    "11:00-13:00",
    "13:30-03:30",
    "04:00-06:00",
];

export const GROUPS = [
    "IDOSR 201",
    "IDOSR 202",
    "IDOSR 203",
    "DDOFS 201",
    "DDOFS 202",
    "DDOFS 203",
    "DDOFS 204",
    "DDOFS 205",
    "DDOFS 206",
    "DDOFS 207",
    "DDOFS 208",
    "DDOFS 209",
    "DDOFS 210",
    "DDOFS 211",
    "DDOFS 212",
    "DD 101",
    "DD 102",
    "DD 103",
    "DD 104",
];

export const PROFS = [
    "Semar",
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
    "Irfaq",
    "Belhaous",
    "Fathallah",
    "Zahraoui",
    "Belaoud",
];

export const ROOMS = [
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
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
    date: "",
    group: "",
    totalHours: 0,
    schedual: [
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ],
    ],
};