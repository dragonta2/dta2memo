<template>
    <div id="home">
        <h1>{{ msg }}</h1>
        <p class="logIn">
            <button class="btn btn-outline-success" v-on:click="googleLogin">googleアカウントでログイン</button>
        </p>
    </div>
</template>

<script>
export default {
    name: 'home',//今回つかってなさそう
    data () {
        return {
            msg: 'マークダウン形式のメモ帳アプリへようこそ！！'
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
    margin: 1rem 0;
}
</style>
