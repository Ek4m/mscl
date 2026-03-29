import { NavigatorScreenParams } from "@react-navigation/native";
import {
  CustomDayPlan,
  CustomPlanDetails,
  PremadePlan,
} from "../modules/workout/types";
import { CreateAiPlanParamList } from "./screens/create-ai/types";
import { PlanStatus } from "../modules/prediction/enums";

export type RootStackParamList = {
  auth: undefined;
  genderSelection: undefined;
  forgotPassword: undefined;
  archivedPlans: undefined;
  resetPassword: undefined;
  register: undefined;
  workoutTracker: { id: number; plan: CustomPlanDetails; weekId: number };
  splash: undefined;
  test: undefined;
  initialInfo: undefined;
  premadePlans: undefined;
  editDay: { dayPlan: CustomDayPlan };
  premadePlanDetails: { plan: PremadePlan };
  onboarding: undefined;
  customPlan: undefined;
  inspectPlan: undefined;
  createAiPlan: NavigatorScreenParams<CreateAiPlanParamList>;
  planDetails: { id: number; sessions?: 1 | 2; status?: PlanStatus };
  home: undefined;
  payment: undefined;
  profile: undefined;
  workoutSession: undefined;
};
