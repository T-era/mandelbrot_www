# WebWorkerとWASMを使ったマルチスレッドのマンデルブロ集合描画
マンデルブロ集合の描画 with WebWorker &amp; WASM

# ビルド

## ビルド環境の要件

Rust, Cargo と Node, npm が使えること

## How to ビルド

```
npm run build
```

ビルド結果は、 out/ 配下に出力する。
Webサーバで out/ を公開すればOK。

# Notice

[main.rs](src/wasm/main.rs)の `WIDTH`, `HEIGHT` 値と、[worker_mgr.js](src/js/web_worker.js)の `WIDTH`, `HEIGHT` 値は一致する必要があります。
