import { toast } from "sonner";

export const handleError = (error: any) => {
  console.error(error);
  const { response } = error;
  if (response?.data?.message) {
    toast.error(response.data.message);
    return { message: response.data.message, status: response.status };
  }
  toast.error("Something went wrong");
  return { message: "Something went wrong", status: response?.status ?? 500 };
};
