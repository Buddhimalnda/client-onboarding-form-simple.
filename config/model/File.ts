import { Status } from "./Status";

export interface FileProp {
  id?: string;
  url: string;
  title: string;
  description?: string;
  catogory?: string;
  file_name: string;
  type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";
  size?: number;
  created_at?: string;
  updated_at?: [string];
  status?: Status;
}