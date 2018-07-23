// npm installしたcssリセット用ファイルを読み込む
import 'shitajicss/docs/css/shitaji.min.css';

// src/scss/style.scssを読み込む（<div id="app">内 すなわち全ページに効く指定）
import './scss/style.scss';

// vueの基本設定ファイルをVueという名前で登録して読み込む
import Vue from 'vue';

// src/App.vueをAppという名前で登録して読み込む
import App from './App.vue';

//Vue初期化の際にVue Routerを使ってrouterを設定する router.jsをrouterという名前で登録して読み込む
import router from "./router";


// Vueコンストラクタ関数 ルートインスタンスを作成
new Vue({
    // マウントする要素のセレクタ
    el: '#app',
    // <div id="app">内にrouterを出力
    router: router,
    render: h => h(App)
});
