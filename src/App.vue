<template>
    <div id="app">
        <div class="container-fluid">
        <!-- /src/main.js内に記述されているnew Vue()時に設定したrouterの内容を表示するコンポーネント。 URLが変更になると自動的にrouter.jsで定義したコンポーネントに切り替わる-->
        <router-view></router-view>
        </div>

        <footer>
            <p class="terms">
                <router-link v-bind:to="{ name: 'terms' }">利用規約</router-link>
            </p>
            <p class="credit">&#9400; DTA2. All rights reserved.</p>
        </footer>
    </div>
</template>

<script>

export default {
    name: 'app' // 今回使ってなさそう
};
</script>

<!-- <style lang="scss">
    @import 'scss/quote.scss';
</style> -->