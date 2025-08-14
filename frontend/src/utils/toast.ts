import toast from "react-hot-toast";

let currentToastId: string | null = null; // Lưu ID của toast hiện tại

const showToast = (type: "success" | "error" | "warning", message: string) => {
  // Nếu đang có toast cũ thì xóa trước
  if (currentToastId) {
    toast.dismiss(currentToastId);
    currentToastId = null;
  }

  const commonOptions = {
    duration: 3000,
    onClose: () => {
      currentToastId = null; // Reset khi toast đóng
    },
  };

  if (type === "success") {
    currentToastId = toast.success(message, commonOptions);
  } else if (type === "error") {
    currentToastId = toast.error(message, commonOptions);
  } else if (type === "warning") {
    currentToastId = toast(message, {
      ...commonOptions,
      style: {
        background: "#facc15",
        color: "#000",
        fontWeight: "bold",
      },
      icon: "⚠️",
    });
  }
};

export const ToastSucess = (msg: string) => showToast("success", msg);
export const ToastError = (msg: string) => showToast("error", msg);
export const ToastWarning = (msg: string) => showToast("warning", msg);
