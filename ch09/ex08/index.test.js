import {
  Action,
  NormalState,
  AlarmSetState,
  AlarmSoundingState,
  SnoozingState,
} from "./index.js";

describe("NormalState", () => {
  it("setAlarm()はアラームセット中状態に遷移する", () => {
    const context = { state: new NormalState() };
    const action = context.state.setAlarm(context);
    expect(context.state).toBeInstanceOf(AlarmSetState);
    expect(action).toBe(Action.NONE);
  });
});

describe("AlarmSetState", () => {
  it("cancelAlarm()は通常状態に遷移する", () => {
    const context = { state: new AlarmSetState() };
    const action = context.state.cancelAlarm(context);
    expect(context.state).toBeInstanceOf(NormalState);
    expect(action).toBe(Action.NONE);
  });

  it("reachedToAlarmTime()はアラーム鳴動中状態に遷移する", () => {
    const context = { state: new AlarmSetState() };
    const action = context.state.reachedToAlarmTime(context);
    expect(context.state).toBeInstanceOf(AlarmSoundingState);
    expect(action).toBe(Action.SOUND_ALARM);
  });
});

describe("AlarmSoundingState", () => {
  it("cancelAlarm()は通常状態に遷移する", () => {
    const context = { state: new AlarmSoundingState() };
    const action = context.state.cancelAlarm(context);
    expect(context.state).toBeInstanceOf(NormalState);
    expect(action).toBe(Action.STOP_ALARM);
  });

  it("snooze()はスヌーズ状態に遷移する", () => {
    const context = { state: new AlarmSoundingState() };
    const action = context.state.snooze(context);
    expect(context.state).toBeInstanceOf(SnoozingState);
    expect(action).toBe(Action.STOP_ALARM);
  });
});

describe("SnoozingState", () => {
  it("elapseSnoozeTime()はアラーム鳴動中状態に遷移する", () => {
    const context = { state: new SnoozingState() };
    const action = context.state.elapseSnoozeTime(context);
    expect(context.state).toBeInstanceOf(AlarmSoundingState);
    expect(action).toBe(Action.SOUND_ALARM);
  });

  it("cancelAlarm()は通常状態に遷移する", () => {
    const context = { state: new SnoozingState() };
    const action = context.state.cancelAlarm(context);
    expect(context.state).toBeInstanceOf(NormalState);
    expect(action).toBe(Action.NONE);
  });
});

describe("状態に定義されていないメソッドを呼び出す", () => {
  it("NormalStateでsetAlarm()以外のメソッドを呼び出すとエラーになる", () => {
    const context = { state: new NormalState() };
    expect(() => context.state.cancelAlarm(context)).toThrow();
    expect(() => context.state.reachedToAlarmTime(context)).toThrow();
    expect(() => context.state.snooze(context)).toThrow();
    expect(() => context.state.elapseSnoozeTime(context)).toThrow();
  });

  it("AlarmSetStateでreachedToAlarmTime()またはcancelAlarm()以外のメソッドを呼び出すとエラーになる", () => {
    const context = { state: new AlarmSetState() };
    expect(() => context.state.setAlarm(context)).toThrow();
    expect(() => context.state.snooze(context)).toThrow();
    expect(() => context.state.elapseSnoozeTime(context)).toThrow();
  });

  it("AlarmSoundingStateでsnooze()またはcancelAlarm()以外のメソッドを呼び出すとエラーになる", () => {
    const context = { state: new AlarmSoundingState() };
    expect(() => context.state.setAlarm(context)).toThrow();
    expect(() => context.state.reachedToAlarmTime(context)).toThrow();
    expect(() => context.state.elapseSnoozeTime(context)).toThrow();
  });

  it("SnoozingStateでelapseSnoozeTime()またはcancelAlarm()以外のメソッドを呼び出すとエラーになる", () => {
    const context = { state: new SnoozingState() };
    expect(() => context.state.setAlarm(context)).toThrow();
    expect(() => context.state.reachedToAlarmTime(context)).toThrow();
    expect(() => context.state.snooze(context)).toThrow();
  });
});
