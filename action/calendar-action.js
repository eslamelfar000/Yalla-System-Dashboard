"use server";
import {
  createEvent,
  deleteEvent,
  updateEvent,
  createTeacherSession,
  updateTeacherSession,
  deleteTeacherSession,
  getTeacherSessions,
} from "@/config/calendar.config";
import { revalidatePath } from "next/cache";

export const AddEvent = async (data) => {
  const response = await createEvent(data);
  revalidatePath("/calendar");
  return response;
};

export const deleteEventAction = async (id) => {
  const response = await deleteEvent(id);
  revalidatePath("/calendar");
  return response;
};

// update event
export const updateEventAction = async (id, data) => {
  const response = await updateEvent(id, data);
  revalidatePath("/calendar");
  return response;
};

// Teacher session actions
export const addTeacherSession = async (data) => {
  console.log("addTeacherSession action called with:", data);
  const response = await createTeacherSession(data);
  console.log("addTeacherSession action response:", response);
  revalidatePath("/calendar");
  return response;
};

export const updateTeacherSessionAction = async (id, data) => {
  console.log("updateTeacherSessionAction called with:", { id, data });
  const response = await updateTeacherSession(id, data);
  console.log("updateTeacherSessionAction response:", response);
  revalidatePath("/calendar");
  return response;
};

export const deleteTeacherSessionAction = async (id) => {
  console.log("deleteTeacherSessionAction called with:", id);
  const response = await deleteTeacherSession(id);
  console.log("deleteTeacherSessionAction response:", response);
  revalidatePath("/calendar");
  return response;
};

export const getTeacherSessionsAction = async (teacherId = null, date = null) => {
  console.log("getTeacherSessionsAction called with:", { teacherId, date });
  const response = await getTeacherSessions(teacherId, date);
  console.log("getTeacherSessionsAction response:", response);
  return response;
};
