<template>
    <div id="app">
        <div class="container-fluid">
        <!-- /src/main.js内に記述されているnew Vue()時に設定したrouterの内容を表示するコンポーネント。 URLが変更になると自動的にrouter.jsで定義したコンポーネントに切り替わる-->
        <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default {
    name: 'app' // 今回使ってなさそう
};
</script>
