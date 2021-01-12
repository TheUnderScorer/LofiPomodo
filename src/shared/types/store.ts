import { Pomodoro } from "./pomodoro";
import { WindowProps, WindowTypes } from "./system";
import { TrelloSettings } from './integrations/trello';

type WindowProperties = `${WindowTypes}Props`;

type WindowPropsStore = {
  [Key in WindowProperties]?: WindowProps;
}

export interface AppStore extends WindowPropsStore {
  pomodoroState?: Pomodoro;
  trello?: TrelloSettings;
}
