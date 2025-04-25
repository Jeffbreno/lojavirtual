import { useState, useCallback } from "react";

const useNotification = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [modal, setModal] = useState({
    show: false,
    title: "",
    body: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: null,
    variant: "primary",
  });

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const showModal = useCallback(
    ({ title, body, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar", variant = "primary" }) => {
      setModal({ show: true, title, body, onConfirm, confirmText, cancelText, variant });
    },
    []
  );

  const hideModal = useCallback(() => {
    setModal((prev) => ({ ...prev, show: false }));
  }, []);

  const confirmModal = useCallback(() => {
    modal.onConfirm?.();
    hideModal();
  }, [modal, hideModal]);

  return {
    toast,
    showToast,
    hideToast,
    modal,
    showModal,
    hideModal,
    confirmModal,
  };
};

export default useNotification;
