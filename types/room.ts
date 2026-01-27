export interface Room {
  _id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  rentAmount: number;
  isAvailable: boolean;
  tenants: { _id: string; username: string; email: string; }[];
}
