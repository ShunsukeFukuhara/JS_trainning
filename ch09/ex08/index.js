// // 目覚まし時計の状態
// export const State = Object.freeze({
//   NORMAL: Symbol("normal"), // 通常
//   ALARM_SET: Symbol("alarmSet"), // アラームセット中
//   ALARM_SOUNDING: Symbol("alarmSounding"), // アラーム鳴動中
//   SNOOZING: Symbol("snoozing"), // スヌーズ中
// });

// // イベント時に発生するアクション
// export const Action = Object.freeze({
//   NONE: Symbol("none"), // 何もしない
//   SOUND_ALARM: Symbol("soundAlarm"), // アラームを鳴らす
//   STOP_ALARM: Symbol("stopAlarm"), // アラームを止める
// });

// // 補足:
// // JavaScript では 列挙型を上記のように記述するが
// // TypeScript では 列挙型を `type Action = "none" | "soundAlarm" | "stopAlarm";` のように代数的データ型を使って記述するのが一般的

// // 目覚まし時計クラス
// export class AlarmClock {
//   #state; // private な属性

//   constructor() {
//     this.#state = State.NORMAL;
//   }

//   // アラーム設定イベント
//   setAlarm() {
//     switch (this.#state) {
//       case State.NORMAL:
//         this.#state = State.ALARM_SET;
//         return Action.NONE;
//       default:
//         return Action.NONE;
//     }
//   }

//   // アラーム解除イベント
//   cancelAlarm() {
//     switch (this.#state) {
//       case State.ALARM_SET:
//         this.#state = State.NORMAL;
//         return Action.NONE;
//       case State.ALARM_SOUNDING:
//         this.#state = State.NORMAL;
//         return Action.STOP_ALARM;
//       case State.SNOOZING:
//         this.#state = State.NORMAL;
//         return Action.NONE;
//       default:
//         return Action.NONE;
//     }
//   }

//   // アラーム設定時刻到達イベント
//   reachedToAlarmTime() {
//     switch (this.#state) {
//       case State.ALARM_SET:
//         this.#state = State.ALARM_SOUNDING;
//         return Action.SOUND_ALARM;
//       default:
//         return Action.NONE;
//     }
//   }

//   // スヌーズイベント
//   snooze() {
//     switch (this.#state) {
//       case State.ALARM_SOUNDING:
//         this.#state = State.SNOOZING;
//         return Action.STOP_ALARM;
//       default:
//         return Action.NONE;
//     }
//   }

//   // スヌーズ設定時間経過イベント
//   elapseSnoozeTime() {
//     switch (this.#state) {
//       case State.SNOOZING:
//         this.#state = State.ALARM_SOUNDING;
//         return Action.SOUND_ALARM;
//       default:
//         return Action.NONE;
//     }
//   }
// }

// #state はプライベートな属性であり、外部から直接値を設定することは避けたい。
// このとき、このコードに対して、すべての状態遷移を網羅するテストを作成することを考える。
// 例えば アラームセット中 の状態から各イベントを受け取ったときのテストを作成するには、事前条件として毎回 通常 状態から、アラーム設定 と アラーム設定時刻到達 のイベントを経て アラームセット中 の状態に遷移させる必要がある。
// これを各状態のテストに対して実施するのは煩雑である。
// この目覚まし時計の状態遷移モデルのテスト性を向上させるためのアプローチとして以下のような方法が考えられる。

// GoF の State パターンを利用し、各状態をクラスとして独立させ、各イベントを各状態クラスのメソッドとして実装する

export const Action = Object.freeze({
  NONE: Symbol("none"), // 何もしない
  SOUND_ALARM: Symbol("soundAlarm"), // アラームを鳴らす
  STOP_ALARM: Symbol("stopAlarm"), // アラームを止める
});

// 状態インターフェース
class AlarmState {
  setAlarm(context) {
    void context;
    throw new Error("現在の状態でsetAlarm()は使えません");
  }
  cancelAlarm(context) {
    void context;
    throw new Error("現在の状態でcancelAlarm()は使えません");
  }
  reachedToAlarmTime(context) {
    void context;
    throw new Error("現在の状態でreachedToAlarmTime()は使えません");
  }
  snooze(context) {
    void context;
    throw new Error("現在の状態でsnooze()は使えません");
  }
  elapseSnoozeTime(context) {
    void context;
    throw new Error("現在の状態でelapseSnoozeTime()は使えません");
  }
}

// 通常状態クラス
export class NormalState extends AlarmState {
  setAlarm(context) {
    context.state = new AlarmSetState();
    return Action.NONE;
  }
}

// アラームセット中状態クラス
export class AlarmSetState extends AlarmState {
  cancelAlarm(context) {
    context.state = new NormalState();
    return Action.NONE;
  }

  reachedToAlarmTime(context) {
    context.state = new AlarmSoundingState();
    return Action.SOUND_ALARM;
  }
}

// アラーム鳴動中状態クラス
export class AlarmSoundingState extends AlarmState {
  cancelAlarm(context) {
    context.state = new NormalState();
    return Action.STOP_ALARM;
  }

  snooze(context) {
    context.state = new SnoozingState();
    return Action.STOP_ALARM;
  }
}

// スヌーズ中状態クラス
export class SnoozingState extends AlarmState {
  cancelAlarm(context) {
    context.state = new NormalState();
    return Action.NONE;
  }

  elapseSnoozeTime(context) {
    context.state = new AlarmSoundingState();
    return Action.SOUND_ALARM;
  }
}
