export type ComplaintStatus = "open" | "in_progress" | "resolved";

export interface Complaint {
  _id: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  resolvedAt: string | null;
  createdAt: string;

  tenantId: {
    _id: string;
    name: string;
    email: string;
  };

  roomId: {
    _id: string;
    roomNumber: string;
    floor: number;
  };
}

export interface CreateComplaintData {
  category: string;
  description: string;
}

