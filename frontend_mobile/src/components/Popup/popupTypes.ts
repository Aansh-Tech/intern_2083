export type PopupType = "success" | "error" | "info" | "warning";

export interface ShowModalOptions {
  type: PopupType;
  title: string;
  message?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void | Promise<void>;
  onSecondary?: () => void;
  allowBackdropDismiss?: boolean;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  allowBackdropDismiss?: boolean;
}

export interface ShowToastOptions {
  type?: PopupType;
  message: string;
  duration?: number;
  variant?: "filled" | "default";
}

export type DialogModalState = {
  kind: "dialog";
  type: PopupType;
  title: string;
  message?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary?: () => void | Promise<void>;
  onSecondary?: () => void;
  allowBackdropDismiss?: boolean;
};

export type ConfirmModalState = {
  kind: "confirm";
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  allowBackdropDismiss?: boolean;
};

export type ModalState = DialogModalState | ConfirmModalState;

export interface ToastState {
  id: string;
  key: string;
  type: PopupType;
  message: string;
  duration: number;
  variant?: "filled" | "default";
}

export interface PopupApi {
  showModal: (options: ShowModalOptions) => void;
  showConfirm: (options: ConfirmOptions) => void;
  showToast: (options: ShowToastOptions) => void;
  hideAll: () => void;
}