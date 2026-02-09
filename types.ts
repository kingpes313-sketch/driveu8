
export type OrderStatus = 'قيد التنفيذ' | 'مكتمل';
export type OrderSource = 'محل' | 'خارجي';

export interface StaffMember {
  id: string;
  name: string;
  role: 'صاحب العمل' | 'موظف';
  image?: string;
  isActive: boolean;
}

export interface AuthUser {
  username: string;
  image?: string;
  isLoggedIn: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  length: string;
  shoulder: string;
  sleeve: string;
  sleeveWidth: string;
  sleeveCuffWidth: string;
  sleeveCuffHeight: string;
  chestWidth: string;
  waistWidth: string;
  collar: string;
  collar1: boolean;
  collar125: boolean;
  collar15: boolean;
  bottom: string;
  armhole: string;
  kaf: boolean;
  ba: boolean;
  isMeasurementComplete: boolean;
  pocketNormal: boolean;
  pocketLaqat: boolean;
  pocketTaklat: boolean;
  isTailoring: boolean;
  isLapping: boolean;
  staffId?: string;
  orderSource: OrderSource;
  notes: string;
  receiptDate: string;
  deliveryDate: string;
  status: OrderStatus;
  createdAt: number;
  // Trash bin logic
  isDeleted?: boolean;
  deletedAt?: number;
}

export interface AppState {
  customers: Customer[];
  staff: StaffMember[];
  searchQuery: string;
  filterStatus: 'الكل' | OrderStatus;
  user: AuthUser | null;
}
