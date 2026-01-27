export interface Tenant {
    _id: string;
    username: string;
    email: string;
    name?: string;
    room?: string | null;
role: "tenant" | "admin";
}

export interface UpdateProfileData {
    name: string;
    email: string;
}
