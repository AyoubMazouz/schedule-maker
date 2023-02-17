import React from "react";
import { TEMPLATES } from "../helpers/templates";
import { LabelsType, Level, Schedule, Template } from "../helpers/types";

interface EditScheduleGrp {
  (
    data: Schedule[],
    setData: (a: Schedule[]) => void,
    scheduleIndex: number,
    value: string
  ): boolean;
}
interface AddNewSchedule {
  (data: Schedule[], template: Template): any;
}
interface DeleteSchedule {
  (data: Schedule[], setData: (a: Schedule[]) => void, id: string): boolean;
}

const useEditor = () => {
  const editScheduleGrp: EditScheduleGrp = (
    data,
    setData,
    scheduleIndex,
    value
  ) => {
    let error = false;
    const copiedData = data.map((sch) => {
      if (sch.group === value) {
        error = true;
        return sch;
      }
      return sch;
    });
    if (error) return false;

    copiedData[scheduleIndex].group = value;
    setData(copiedData);
    return true;
  };

  const addNewSchedule: AddNewSchedule = (data, template) => {
    const newSchedule = JSON.parse(JSON.stringify(TEMPLATES[template].data));
    if (data.length === 0) return [newSchedule];

    if (!data[data.length - 1].group) return false;

    return [...data, newSchedule];
  };

  const deleteSchedule: DeleteSchedule = (data, setData, id) => {
    const newData = data.filter((sch) => sch.group !== id);
    if (data.length === newData.length) return false;
    setData(newData);
    return true;
  };

  return {
    editScheduleGrp,
    deleteSchedule,
    addNewSchedule,
  };
};

export default useEditor;
