export interface BaseLabelsTypes {
  id: number;
  value: string;
  createdAt: {};
  modifiedAt: {};
}

export interface Level extends BaseLabelsTypes {
  numOfGrps: string;
  modules: string[];
}
export interface Trainer extends BaseLabelsTypes {
  preferedRooms: string[];
}
export interface Room extends BaseLabelsTypes {}
export interface Event extends BaseLabelsTypes {}

export type LabelsType = {
  levels: Level[];
  trainers: Trainer[];
  rooms: Room[];
  events: Event[];
};

export interface PublishedDocument {
  id: number;
  userId: string;
  url: string;
  createdAt: any;
}

export interface Schedual {
  totalHours: string;
  group: string;
  schedual: string[][][];
}
export interface Document {
  id: number;
  userId: string;
  data: string;
  createdAt: any;
  modifiedAt: any;
}

export interface PublishedDocument {
  id: number;
  userId: string;
  createdAt: any;
  url: string;
}
