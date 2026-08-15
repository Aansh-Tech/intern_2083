import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Keyboard } from "react-native";
import AppModal from "./AppModal";
import AppToast from "./AppToast";
import type {
  ConfirmOptions,
  ModalState,
  PopupApi,
  ShowModalOptions,
  ShowToastOptions,
  ToastState,
} from "./popupTypes";

const PopupContext = createContext<PopupApi | null>(null);

let toastCounter = 0;

function dialogKey(options: ShowModalOptions): string {
  return `dialog|${options.type}|${options.title}|${options.message ?? ""}|${options.primaryText ?? ""}`;
}

function confirmKey(options: ConfirmOptions): string {
  return `confirm|${options.title}|${options.message ?? ""}|${options.confirmText ?? ""}|${options.destructive ?? false}`;
}

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const lastModalKeyRef = useRef<string | null>(null);
  const toastKeysRef = useRef<Set<string>>(new Set());

  const showModal = useCallback((options: ShowModalOptions) => {
    Keyboard.dismiss();
    const key = dialogKey(options);
    if (lastModalKeyRef.current === key) return;
    lastModalKeyRef.current = key;
    setModal({ kind: "dialog", ...options });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    Keyboard.dismiss();
    const key = confirmKey(options);
    if (lastModalKeyRef.current === key) return;
    lastModalKeyRef.current = key;
    setModal({ kind: "confirm", ...options });
  }, []);

  const hideModal = useCallback(() => {
    lastModalKeyRef.current = null;
    setModal(null);
  }, []);

  const showToast = useCallback((options: ShowToastOptions) => {
    Keyboard.dismiss();
    const key = `${options.type ?? "info"}|${options.message}`;
    if (toastKeysRef.current.has(key)) return;
    toastKeysRef.current.add(key);
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [
      ...prev,
      {
        id,
        key,
        type: options.type ?? "info",
        message: options.message,
        duration: options.duration ?? 2600,
        variant: options.variant,
      },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) toastKeysRef.current.delete(target.key);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const hideAll = useCallback(() => {
    hideModal();
    toastKeysRef.current.clear();
    setToasts([]);
  }, [hideModal]);

  const value = useMemo<PopupApi>(
    () => ({ showModal, showConfirm, showToast, hideAll }),
    [showModal, showConfirm, showToast, hideAll]
  );

  return (
    <PopupContext.Provider value={value}>
      {children}
      <AppModal modal={modal} onDismiss={hideModal} />
      <AppToast toasts={toasts} onDismiss={dismissToast} />
    </PopupContext.Provider>
  );
}

export function usePopup(): PopupApi {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}