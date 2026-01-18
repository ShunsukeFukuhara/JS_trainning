## 問題

主にクラウド上で動作するプログラムは、いわゆる Graceful Shutdown という動作が求められ、上記のような処理が必要な場合がある。Kubernetes や Amazon ECS などの Docker ランタイム上でコンテナの Graceful Shutdown のために送信されるシグナルの種類は何か書きなさい。

## 解答

`SIGTERM`
[参考](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
