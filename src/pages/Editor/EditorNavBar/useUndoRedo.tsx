import React from "react";
import { TEMPLATES } from "../../../helpers/templates";

const useUndoRedo = () => {
  const undo = (
    data: any,
    setData: any,
    history: any,
    hIndex: any,
    setHIndex: any
  ) => {
    console.log(history);
    if (hIndex < 0) return;
    const h = history[hIndex];
    let currData = JSON.parse(JSON.stringify(data));
    if (h.type === "TABLE_INSERT") {
      currData[h.x].schedule[h.y][h.z][h.row] = h.prev;
      if (h.fusionMode) {
        const offset = h.z % 2 === 0 ? 1 : -1;
        currData[h.x].schedule[h.y][h.z + offset][h.row] = h.prev;
      }
    } else if (h.type === "INFO_INSERT") {
      currData[h.x].group = h.prev;
    } else if (h.type === "ADD_SCHEDULE") {
      currData = currData.slice(0, currData.length - 1);
      h.setCurrSchedule(currData.length - 1);
      h.setSelectedCell((x: number[]) =>
        x ? [currData.length - 1, x[1], x[2]] : null
      );
    } else if (h.type === "DEL_SCHEDULE") {
      currData.splice(h.x, 0, h.prev);
      h.setCurrSchedule(currData.length - 1);
      h.setSelectedCell((x: number[]) =>
        x ? [currData.length - 1, x[1], x[2]] : null
      );
    } else if (h.type === "CLEAR_CELL") {
      currData[h.x].schedule[h.y][h.z] = h.prev;
      if (h.fusionMode) {
        const offset = h.z % 2 === 0 ? 1 : -1;
        currData[h.x].schedule[h.y][h.z + offset] = h.prev;
      }
    }
    setData(currData);
    setHIndex((x: any) => --x);
  };

  const redo = (
    data: any[],
    setData: Function,
    history: any[],
    hIndex: number,
    setHIndex: Function
  ) => {
    if (hIndex === history.length - 1) return;

    const h = history[hIndex + 1];
    let currData = JSON.parse(JSON.stringify(data));

    if (h.type === "TABLE_INSERT") {
      currData[h.x].schedule[h.y][h.z][h.row] = h.next;
      if (h.fusionMode) {
        const offset = h.z % 2 === 0 ? 1 : -1;
        currData[h.x].schedule[h.y][h.z + offset][h.row] = h.next;
      }
    } else if (h.type === "INFO_INSERT") {
      currData[h.x].group = h.next;
    } else if (h.type === "ADD_SCHEDULE") {
      const newSchedule = JSON.parse(
        JSON.stringify(TEMPLATES[h.template].data)
      );
      currData.push(newSchedule);
      h.setCurrSchedule(currData.length - 1);
      h.setSelectedCell((x: number[]) =>
        x ? [currData.length - 1, x[1], x[2]] : null
      );
    } else if (h.type === "DEL_SCHEDULE") {
      currData = currData.filter((_: any, i: number) => i !== h.x);
      h.setCurrSchedule(currData.length - 1);
      h.setSelectedCell((x: number[]) =>
        x ? [currData.length - 1, x[1], x[2]] : null
      );
    } else if (h.type === "CLEAR_CELL") {
      currData[h.x].schedule[h.y][h.z] = ["", "", "", ""];
      if (h.fusionMode) {
        const offset = h.z % 2 === 0 ? 1 : -1;
        currData[h.x].schedule[h.y][h.z + offset] = ["", "", "", ""];
      }
    }
    setData(currData);
    setHIndex((x: any) => ++x);
  };

  // Record Action for undo and redo.
  const record = (
    history: any[],
    setHistory: Function,
    hIndex: number,
    setHIndex: Function,
    action: {}
  ) => {
    // If new data is inserted and the pointer is in the middle.
    // Remove all action that it index is greater than pointer index.
    if (hIndex !== history.length - 1) {
      setHistory((x: any) => [...x.slice(0, hIndex + 1), action]);
    }
    // Add new action.
    else {
      setHistory((x: any) => [...x, action]);
    }
    // increment the index.
    setHIndex((x: number) => ++x);
  };

  return { undo, redo, record };
};

export default useUndoRedo;
