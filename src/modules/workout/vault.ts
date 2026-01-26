export enum MuscleGroup {
  // Upper Body - Push
  Chest = "chest",
  UpperChest = "upper-chest",
  LowerChest = "lower-chest",
  Shoulders = "shoulders",
  FrontDelts = "front-delts",
  SideDelts = "side-delts",
  RearDelts = "rear-delts",
  Triceps = "triceps",

  // Upper Body - Pull
  Back = "back",
  Lats = "lats",
  UpperBack = "upper-back",
  LowerBack = "lower-back",
  Traps = "traps",
  Rhomboids = "rhomboids",
  Biceps = "biceps",
  Forearms = "forearms",
  Neck = "neck",

  // Lower Body
  Quads = "quads",
  Hamstrings = "hamstrings",
  Glutes = "glutes",
  Calves = "calves",
  Adductors = "adductors",
  Abductors = "abductors",

  // Core
  Abs = "abs",
  Obliques = "obliques",

  // Specialty
  Serratus = "serratus",

  // General
  Cardio = "cardio",
  FullBody = "full-body",
}

export const MuscleGroupTitles: Record<MuscleGroup, string> = {
  [MuscleGroup.Chest]: "Chest",
  [MuscleGroup.UpperChest]: "Upper Chest",
  [MuscleGroup.LowerChest]: "Lower Chest",
  [MuscleGroup.Shoulders]: "Shoulders",
  [MuscleGroup.FrontDelts]: "Front Delts",
  [MuscleGroup.SideDelts]: "Side Delts",
  [MuscleGroup.RearDelts]: "Rear Delts",
  [MuscleGroup.Triceps]: "Triceps",
  [MuscleGroup.Back]: "Back",
  [MuscleGroup.Lats]: "Lats",
  [MuscleGroup.UpperBack]: "Upper Back",
  [MuscleGroup.LowerBack]: "Lower Back",
  [MuscleGroup.Traps]: "Traps",
  [MuscleGroup.Rhomboids]: "Rhomboids",
  [MuscleGroup.Biceps]: "Biceps",
  [MuscleGroup.Forearms]: "Forearms",
  [MuscleGroup.Neck]: "Neck",
  [MuscleGroup.Quads]: "Quads",
  [MuscleGroup.Hamstrings]: "Hamstrings",
  [MuscleGroup.Glutes]: "Glutes",
  [MuscleGroup.Calves]: "Calves",
  [MuscleGroup.Adductors]: "Adductors",
  [MuscleGroup.Abductors]: "Abductors",
  [MuscleGroup.Abs]: "Abs",
  [MuscleGroup.Obliques]: "Obliques",
  [MuscleGroup.Serratus]: "Serratus",
  [MuscleGroup.Cardio]: "Cardio",
  [MuscleGroup.FullBody]: "Full Body",
};
