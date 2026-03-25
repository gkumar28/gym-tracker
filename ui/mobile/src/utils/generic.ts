import { API_CONSTANTS, UI_CONSTANTS } from "../constants/constants";
import { ExerciseItem } from "../types/common";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc); 
dayjs.extend(customParseFormat); 

// ui/mobile/src/utils/dateUtils.ts
export function formatDate(date: Date): string {
  return dayjs(date).format(UI_CONSTANTS.DATE_FORMAT);
}

export function getDate(dateStr: string): Date {
  return dayjs(dateStr, UI_CONSTANTS.DATE_FORMAT).local().toDate();
}

export function formatDateToAPI(date: Date): string {
  return dayjs(date).utc().format(API_CONSTANTS.BE_DATE_FORMAT);
}

export function getDateFromAPI(dateStr: string): Date {
  return dayjs.utc(dateStr, API_CONSTANTS.BE_DATE_FORMAT).local().toDate();
}

export function getExerciseItems(exerciseEntities) {
  const items: ExerciseItem[] = [];

  for (let i = 0;i < exerciseEntities.length;i++) {
    let exercise = exerciseEntities[i];
    items.push({
      type: 'EXERCISE',
      data: {
        exerciseName: exercise.exerciseName,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          restSeconds: set.restSeconds,
        })),
      },
    });

    // 2. Add the Rest item if a rest duration exists
    if (i != exerciseEntities.length - 1) {
      items.push({
        type: 'REST',
        data: {
          restAfterExercise: exercise.restAfterExerciseSeconds,
        },
      });
    }
  }

  return items;
}

export function getExerciseEntity(workoutItems: ExerciseItem[]) {
  const exercises = [];
  for (let i = 0; i < workoutItems?.length; i++) {
    const item = workoutItems[i];
  
    if (item.type === 'EXERCISE') {
      let restAfter = 0;
      const nextItem = workoutItems[i + 1];
      if (nextItem && nextItem.type === "REST") {
        restAfter = nextItem.data.restAfterExercise;
      }
  
      exercises.push({
        exerciseName: item.data.exerciseName,
        sets: item.data.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          restSeconds: set.restSeconds,
        })),
        restAfterExerciseSeconds: restAfter,
      });
    }
  }
  exercises.forEach((exercise, index) => {
    exercise.exerciseOrder = index;
  });

  return exercises;
}

export function equalsIgnoreCase(str1: string, str2: string): boolean {
  if (!str1 && !str2) { return true; }
  if (!str1 || !str2) { return false; }
  return str1.toLowerCase() === str2.toLowerCase();
}