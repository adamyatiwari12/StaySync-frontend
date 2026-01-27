import API from "@/lib/axios";
import { Room } from "@/types/room";
import { AxiosResponse } from "axios";

export const getRooms = (): Promise<AxiosResponse<Room[]>> => {
  return API.get("/rooms");
};

export const getAvailableRooms = (): Promise<AxiosResponse<Room[]>> => {
  return API.get("/rooms/available");
};

export const createRoom = (data: Partial<Room>): Promise<AxiosResponse<Room>> => {
  return API.post("/rooms", data);
};

export const assignTenant = (data: {
  roomId: string;
  tenantId: string;
}) => {
  return API.post("/rooms/assign", data);
};

export const removeTenant = (data: { tenantId: string }) => {
  return API.post("/rooms/remove", data);
};

export const deleteRoom = (id: string): Promise<AxiosResponse<{ message: string }>> => {
  return API.delete(`/rooms/${id}`);
};
