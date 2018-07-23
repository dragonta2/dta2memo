<template>
    <div id="top">
        <!-- Home 44行目あたりのcomponentsで登録した名前 -->
        <!-- isLoginがtrueではなかったら（falseだったら）Homeを表示 -->
        <Home v-if="!isLogin"></Home>
        <!-- Home 52行目あたりのcomponentsで登録した名前 -->
        <!-- isLoginがtrueだったらEditorを表示 -->

        <!-- Editor 53行目あたりのcomponentsで登録した名前 -->
        <!-- 呼び出すコンポーネントにデータを引き渡す。 属性(プロパティ）としてuserDataの内容をuserへ格納 / → src/components/Editor.vue（子コンポーネント） 内の記述 props: ['user']で受取る -->
        <Editor v-if="isLogin" v-bind:user="userData"></Editor>
            
        <p class="terms">
            <router-link v-bind:to="{ name: 'terms' }">利用規約</router-link>
        </p>
    </div>
</template>

<script>
// src/components/Home.vueをHomeという名前で登録して読み込む
import HomeVue from '../components/Home.vue';

// import 登録したい名前 from '相対パスでコンポーネント化したいvueファイル' これで登録して読み込む
import EditorVue from '../components/Editor.vue';

export default {
    // src/router.jsで設定されたname: "top" → Top.vueコンポーネント（このテンプレート内）の内容を出力
    name: 'top', // name: 'top' 今回つかってなさそう
    data () {
        return {
            isLogin: false,
            userData: null
        };
    },
    //ライフサイクルフック コンポーネント作成時に実行される
    created: function(){
      　//firebaseから認証されたログインデータはuser変数に格納されているのでそれを受取る
        firebase.auth().onAuthStateChanged(user => {
            console.log(user)
            // userのデータを受け取れたら
            if(user){
                this.isLogin = true
                this.userData = user
                console.log('ログインしてます')
            // userのデータを受け取れなかったら
            } else {
                this.isLogin = false
                this.userData = null //必要無い気もする
                console.log('ログインしていません')
            };
        });
    },
    //コンポーネントの登録
    components: {
        //　登録するタグ名: 13行目あたりのimportで登録している名前
        Home: HomeVue,
        Editor: EditorVue
    }
}
</script>
