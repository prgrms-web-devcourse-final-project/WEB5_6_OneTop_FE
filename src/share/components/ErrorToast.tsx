import Swal from "sweetalert2";

const ErrorToast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: "error",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showErrorToast = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "오류가 발생했습니다.";

  ErrorToast.fire({
    title: message,
  });
};
