export interface User {
  "id": number,
  "username": string,
  "firstname"?: string,
  "lastname"?: string,
  "grade"?: number,
  "universityId"?: number,
  "points"?: number,
  "cohort"?: number,
  "role": "user" | "admin" | "superadmin"
}
export interface Admin {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface SuperAdmin {
  id: number;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
