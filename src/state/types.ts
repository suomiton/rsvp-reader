export interface RenderModel {
  readonly prefix: string;
  readonly highlight: string;
  readonly suffix: string;
}

export interface AppState {
  readonly text: string;
  readonly tokens: readonly string[];
  readonly models: readonly RenderModel[];
  readonly index: number;
  readonly wpm: number;
  readonly error: string | null;
}

export type AppAction =
  | { readonly type: "SET_TEXT"; readonly payload: string }
  | { readonly type: "SET_WPM"; readonly payload: number }
  | {
      readonly type: "PREPARE_READING";
      readonly payload: {
        readonly tokens: string[];
        readonly models: RenderModel[];
      };
    }
  | { readonly type: "SET_INDEX"; readonly payload: number }
  | { readonly type: "STEP_FORWARD" }
  | { readonly type: "STEP_BACK" }
  | { readonly type: "SET_ERROR"; readonly payload: string }
  | { readonly type: "CLEAR_ERROR" }
  | { readonly type: "RESET_READER" };

export const initialState: AppState = {
  text: "",
  tokens: [],
  models: [],
  index: 0,
  wpm: 300,
  error: null,
};
