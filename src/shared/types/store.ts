import { Pomodoro } from "./pomodoro";
import { WindowProps, WindowTypes } from "./system";

type WindowProperties = `${WindowTypes}Props`;

type WindowPropsStore = {
  [Key in WindowProperties]?: WindowProps;
}

export interface AppStore extends WindowPropsStore {
  pomodoroState?: Pomodoro;
}
