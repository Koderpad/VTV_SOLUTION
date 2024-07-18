export interface WalletResponse {
  status: string;
  message: string;
  code: number;
  walletDTO: WalletDTO;
}

export interface WalletDTO {
  walletId: number;
  balance: number;
  status: WalletStatus;
  updateAt: string;
  transactionDTOs: TransactionDTO[];
}

export interface TransactionDTO {
  transactionId: string;
  walletId: number;
  orderId: string;
  money: number;
  type: string;
  status: TransactionStatus;
  createAt: string;
}

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}

export enum TransactionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}
