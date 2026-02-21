import { NavigatorScreenParams } from "@react-navigation/native";
import { CustomPlanDetails, PremadePlan } from "../modules/workout/types";
import { CreateAiPlanParamList } from "./screens/create-ai/types";

export type RootStackParamList = {
  auth: undefined;
  register: undefined;
  workoutTracker: { id: number; plan: CustomPlanDetails; weekId: number };
  splash: undefined;
  test: undefined;
  initialInfo: undefined;
  premadePlans: undefined;
  premadePlanDetails: { plan: PremadePlan };
  onboarding: undefined;
  customPlan: undefined;
  inspectPlan: undefined;
  createAiPlan: NavigatorScreenParams<CreateAiPlanParamList>;
  planDetails: { id: number };
  home: undefined;
  payment: undefined;
  profile: undefined;
  workoutSession: undefined;
};
