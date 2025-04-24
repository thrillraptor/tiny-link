import { toast } from "react-toastify";

export default function Toast(type: "success" | "error", message: string) {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
}
