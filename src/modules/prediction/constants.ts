export interface Exercise {
  id: string;
  name: string;
  muscle: string;
}

export const EXERCISE_DATABASE: Exercise[] = [
  { id: '1', name: 'Bench Press', muscle: 'Chest' },
  { id: '2', name: 'Incline Dumbbell Fly', muscle: 'Chest' },
  { id: '3', name: 'Squat', muscle: 'Legs' },
  { id: '4', name: 'Leg Press', muscle: 'Legs' },
  { id: '5', name: 'Deadlift', muscle: 'Back' },
  { id: '6', name: 'Pull Ups', muscle: 'Back' },
  { id: '7', name: 'Shoulder Press', muscle: 'Shoulders' },
  { id: '8', name: 'Lateral Raises', muscle: 'Shoulders' },
  { id: '9', name: 'Bicep Curls', muscle: 'Arms' },
  { id: '10', name: 'Tricep Pushdowns', muscle: 'Arms' },
];

export const MUSCLE_GROUPS = ['All', 'Chest', 'Legs', 'Back', 'Shoulders', 'Arms'];