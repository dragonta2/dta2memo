<template>
    <div id="home">
        <h1>{{ msg }}</h1>
        
        <p>マークダウン記法で書いた内容がリアルタイムにプレビューできるシンプルなメモ帳です</p>
        <p>googleアカウントをお持ちの方は、すぐにお使いいただけます</p>
        <p class="logIn">
            <button class="btn btn-outline-success" v-on:click="googleLogin"><i class="fa fa-google"></i>googleアカウントでログイン</button>
        </p>
    </div>
</template>

<script>
export default {
    name: 'home',//今回つかってなさそう
    data () {
        return {
            msg: 'マークダウン形式のメモ帳アプリ「dta2memo」'
        };
    },
    methods: {
        //googleログインで認証させるための関数
        googleLogin: function() {
            firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
        }
    }
};
</script>

<style lang="scss" scoped>
.logIn {
    margin: 2.8rem 0;
    button {
        font-size: 2rem;
        padding: .8rem 1.2rem;
        i {
            margin-right: 1rem;
            vertical-align: middle;
        }
    }
}
</style>
