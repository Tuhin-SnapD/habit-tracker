export type Habit = {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  targetPerWeek?: number;
  createdAt: string;
  archived: boolean;
};

export type Completion = {
  habitId: string;
  date: string;
};

export type EmailJSConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
};

export type Settings = {
  theme: 'light' | 'dark';
  weekStartsOn: 0 | 1;
  onboarded?: boolean;
  name?: string;
  backupEmail?: string;
  reportTime?: string;          // "HH:MM" 24h
  lastReportSentDate?: string;  // YYYY-MM-DD
  emailjs?: EmailJSConfig;
};
