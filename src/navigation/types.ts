export type RootStackParamList = {
  auth: undefined;
  register: undefined;
  workoutTracker: { id: number; planId: number };
  splash: undefined;
  upload: undefined;
  onboarding: undefined;
  customPlan: undefined;
  inspectPlan: undefined;
  analyzing: undefined;
  confirmEquipments: { predictions: string[] };
  planDetails: { id: number };
  preferences: undefined;
  home: undefined;
  previewPlan: undefined;
  payment: undefined;
  profile: undefined;
  workoutSession: undefined;
};
