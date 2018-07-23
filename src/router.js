// vueの基本設定ファイルをVueという名前で登録して読み込む
import Vue from 'vue';

// myvueapp/package.json内のvue-routerをVueRouterという名前で登録して読み込む
import VueRouter from 'vue-router';

// src/views/Top.vueをTopという名前で登録して読み込む
import Top from './views/Top';

// src/views/Terms.vueをTermsという名前で登録して読み込む
import Terms from './views/Terms';

//npmとして読みこんだVueRouterを利用するために登録する
Vue.use(VueRouter);

//routes配列内に順番に表示するページ情報を追加する
const routes = [
    {
        //表示する際のURLパス
        path: "/",
        //そのRouteにつける名前（任意）
        name: "top",
        //表示するコンポーネント
        component: Top
    },
    {
        //表示する際のURLパス
        path: "/terms",
        //そのRouteにつける名前（任意）
        name: "terms",
        //表示するコンポーネント
        component: Terms
    }
];

export default new VueRouter({
    //変数routesに登録された配列（ページ情報）の内容をVueRouterとして出力
    routes: routes
});
