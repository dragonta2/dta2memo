<template>
    <div class="editor">
        <h1>エディター画面</h1>
        <!-- googleアカウント userデータ内のdisplayNameというキーに格納されたログイン名を取得 -->
        <div class="row flex-row justify-content-end">
            <!-- <p v-on:click="showside = !showside">></p> -->
            <p v-on:click="toggleWriteArea">記述エリア</p>｜
            <p v-on:click="toggleSampleArea">サンプルエリア</p>
            <p class="name col-3 align-self-center">ユーザーネーム：{{ user.displayName }}</p>
            <p class="logOut col-2"><button class="btn btn-outline-warning" @click="logout">ログアウト</button></p>
        </div>

        <div class="org_list row">
            <div class="org_controlAreaWrap">
                <h2 class="org_areaTitle org_accordionHeader" v-on:click="toggleControlArea">メモのリスト
                    <i class="fa fa-2x fa-angle-down org_icon" v-bind:class="{ rotate: showControlArea }"></i>
                </h2>
                <transition v-on:before-enter="onBeforeEnter" v-on:enter="onEnter" v-on:before-leave="onBeforeLeave" v-on:leave="onLeave">
                    <div class="org_controlArea org_accordion" v-show="showControlArea">
                        <ul class="org_memoListArea">
                            <!-- :data-selected="index == selectedIndex" メモのindexが現在選択されているものと一致した場合には動的にdata-selected="true"という属性がつくようになる -->
                            <li v-for="(memo, index) in memos" @click="selectMemo(index)">
                                <p v-if="memo.markdown" :data-selected="index == selectedIndex">{{ displayTitle(memo.markdown)}}</p>
                                <p v-if="!memo.markdown" :data-selected="index == selectedIndex">{{ displayNonTitle(memo.markdown) }}</p>
                            </li>
                        </ul>
                        <ul class="org_btnArea">
                            <li>
                                <button class="org_addMemoBtn btn btn-outline-info" @click="addMemo">メモの追加</button>
                            </li>

                            <li>
                                <button class="org_saveMemoBtn btn btn-outline-info" v-on:click="saveMemos">メモの保存</button>
                            </li>

                            <!-- リストの数が2つ以上あってマークダウン記法サンプル以外が選択されている場合 -->
                            <!-- <li v-if="memos.length > 1 && !this.selectedIndex == 0">
                                <button class="deleteMemoBtn btn btn-outline-info" v-on:click="deleteMemo">選択中のメモの削除</button>
                            </li> -->
                            <!-- リストの数が2つ以上あってマークダウン記法サンプルが選択されている場合 -->
                            <!-- <li v-if="memos.length > 1 && this.selectedIndex == 0">
                                <button class="deleteMemoBtn btn btn-outline-info">選択中のメモの削除はできません</button>
                            </li> -->
                            
                            <!-- マークダウン記法サンプル以外が選択されている場合 -->
                            <!-- <li v-if="!this.selectedIndex == 0">
                                <button class="deleteMemoBtn btn btn-outline-info" v-on:click="deleteMemo">選択中のメモの削除</button>
                            </li> -->
                            <!-- マークダウン記法サンプルが選択されている場合 -->
                            <!-- <li v-if="this.selectedIndex == 0">
                                <button class="deleteMemoBtn btn btn-outline-info">記法サンプルは削除はできません</button>
                            </li> -->

                            <!-- マークダウン記法サンプルが選択されている場合以外は削除ボタンを表示 -->

                            <li v-if="!this.selectedIndex == 0">
                                <button class="org_deleteMemoBtn btn btn-outline-danger" v-on:click="deleteMemo">選択中のメモの削除</button>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div><!-- /.org_controlAreaWrap -->
        </div><!-- /.org_list -->

        <div class="org_memo row">
            <!-- v-modelでinputやtextareaの状態をコンポーネントのデータmarkdownの中へ格納する データバインディング -->
            <transition name="org_slide-fade">
                <div class="org_writeAreaWrap col-lg-6" v-show="showWriteArea">
                    <h2 class="org_areaTitle">記述エリア</h2>
                    <textarea class="org_writeArea" v-model="memos[selectedIndex].markdown" ref="markdown"></textarea>
                </div>
            </transition>

            <!-- v-htmlで指定されたpreview()関数の実行結果がHTMLとして描画される XSSの原因になるのでユーザー間で共有するようなものを作る場合は注意 -->
            <!-- 三項演算子でclassの付与を振り分け -->
            <div class="org_previewAreaWrap" v-bind:class="[showWriteArea === true ?'col-lg-6' : 'col-lg-12']">
                <h2 class="org_areaTitle">プレビューエリア</h2>
                <div class="org_previewArea markdown-body" v-html="preview()"></div>
            </div>
        </div>

        <div class="org_memoSample">
            <!-- v-modelでinputやtextareaの状態をコンポーネントのデータmarkdownの中へ格納する データバインディング -->
            <transition name="org_slide-fade-sample">
                <div class="org_accordionSample row" v-show="showSampleArea">
                    <div class="org_writeAreaWrap col-lg-6">
                            <h2 class="org_areaTitle">マークダウンサンプル 記述エリア</h2>
                            <textarea class="org_writeArea" v-model="memos[0].markdown" ref="markdown"></textarea>
                    </div>
                    <!-- v-htmlで指定されたpreview()関数の実行結果がHTMLとして描画される XSSの原因になるのでユーザー間で共有するようなものを作る場合は注意 -->
                    <div class="org_previewAreaWrap col-lg-6">
                        <h2 class="org_areaTitle">マークダウンサンプル プレビューエリア</h2>
                        <div class="org_previewArea markdown-body" v-html="previewSample()"></div>
                    </div><!-- /.org_previewAreaWrap -->
                </div>
            </transition>
                
        </div>

    </div>
</template>

<script>
//npmでインストールしたマークダウン書式 → HTML変換してくれるnpmモジュールのmarkedを import 登録したい名前 from '読み込みたいモジュール名' これで登録して読み込む
// import marked from 'marked';
import markdown from '../lib/markdown';
import sampleMarkdown from '../assets/sample';


export default {
    // つけたname: editorは今回は使用していなそう。。
    name: 'editor',
    // src/views/Top.vue（親コンポーネント）内の記述 <Editor>コンポーネントタグからEditor.vue内へ変数userのデータをprops downで受取る
    //props:['user'] 親コンポーネントから受け継ぐデータを定義
    props: ['user'],
    
    data: function() {
        return {
             // メモを複数保存するための配列
             memos:[
                 // markdownというキーにマークダウンで記述されたテキストが入る
                 { markdown: sampleMarkdown }
             ],
             // 編集・プレビューしているデータの配列番号（インデックス）が入る
             selectedIndex: 0,
             isSaving: false,
             nonTitleText: "No TEXT",
             // アコーディオン用
             showControlArea: true,
             showWriteArea: true,
             showSampleArea: true,
        }
    }, 
    //ライフサイクルフック コンポーネント作成時に実行される
    created: function(){
        firebase
        //DBへの接続
        .database()
        //パスの指定
        .ref('memos/' + this.user.uid)
        //1回だけの読み込み
        .once('value')
        //次に定義した関数が結果とともに読み込まれる .then(result => {} → promise形式でデータを受信 データの読み込みが終わり次第 then内に定義した関数が結果ととともに読み込まれる 
        .then(result => {
            // result.val() → 指定のパスのデータを取得
            //はじめて作成された時は結果がnullなのでif文で追加データがあった場合のみにmemosを上書きする
            if(result.val()){
                this.memos = result.val();
                this.focusMemo();
            }
        });
    },
    //ライフサイクルフック コンポーネントの描画完了時
    mounted: function(){
        this.focusMemo(); 
        document.onkeydown = e => {
            // 関数内のeはキーボードの押下されたイベント自体で、そのイベントの.metaKeyでControlキーが押されているかチェック、e.keyで同時にsキーも押されているかチェックしている。
            if(e.key == 's' && e.metaKey){
                this.saveMemos();
                return false;
            }
        };
    },
    //ライフサイクルフック コンポーネントの削除時（ログアウトなど）
    beforeDestroy: function(){
        // コンポーネントがログアウトなどで削除されるタイミングで実行されるbeforeDestroyで設定を消す
        document.onkeydown = null;
    },
    methods: {
        logout: function(){
            firebase.auth().signOut();
        },
        // 配列の最後にデータが追加される
        addMemo: function(){
            this.memos.push({
                markdown: ""
            });

            this.selectedIndex = this.memos.length - 1;
            this.focusMemo();
        },
        /*deleteMemo: function(){
            const title = this.displayTitle(this.memos[this.selectedIndex].markdown);
                if(confirm(title + 'を削除します')) {
                    // splice 配列の任意の位置からデータを取り出す（削除） splice(選択されているインデックス番号,1つの要素を取り出す)
                    this.memos.splice(this.selectedIndex,1);
                    // もし選択されているインデックス番号が0よりも大きかったら
                    if (this.selectedIndex > 0) {
                        // 選択されているインデックス番号から1マイナスする
                        this.selectedIndex--;
                    }else if(this.selectedIndex == 0) {
                        this.selectedIndex;
                    }
                }
        },*/
        deleteMemo: function(){
            const title = this.displayTitle(this.memos[this.selectedIndex].markdown);
            const nonTitle = this.displayNonTitle();

            // マークダウン記法サンプルは削除しない
            if(!this.selectedIndex == 0){
                if(confirm(
                    (title || nonTitle) + 'を削除しますか？'
                )){
                    // splice 配列の任意の位置からデータを取り出す（削除） splice(選択されているインデックス番号,1つの要素を取り出す)
                    this.memos.splice(this.selectedIndex,1);
                    this.selectedIndex--;
                    // もし選択されているインデックス番号が0よりも大きかったら
                    // if (this.selectedIndex > 0) {
                    //     // 選択されているインデックス番号から1マイナスする
                    //     this.selectedIndex--;
                    // }
                }
            }
        },
        saveMemos: function(){
            if (this.isSaving){
                return;
            }
            this.isSaving = true;
            firebase
                .database()
                .ref('memos/' + this.user.uid)
                .set(this.memos)
                .then(res => {
                    this.isSaving = false;
            });
        },
        // 発火された（この場合クリック）配列のindex番号を取得してselectedIndexに代入
        selectMemo: function(index){
            this.selectedIndex = index;
            this.focusMemo();
        },
        focusMemo: function(){
            this.$nextTick(() => {
                const markdownDom = this.$refs.markdown;
                markdownDom.focus();
                markdownDom.scrollTop = markdownDom.getClientRects()[0].height;
            });
        },
        preview: function(){
            return markdown(this.memos[this.selectedIndex].markdown);
        },
        previewSample: function(){
            return markdown(this.memos[0].markdown);
        },
        displayTitle: function(text) {
            return text.split(/\n/)[0].replace(/#+\s|-\s/, '');
        },
        displayNonTitle: function(text) {
            return this.nonTitleText;
        },
        //メモのタイトル（メモの1行目の文章） 改行箇所で分割して配列にする。その配列のはじめの値(インデックス番号 0)を返却する
        // displayTitle: function(text){
        //     return text.split(/\n/)[0].replace(/#+\s/, '') || 'no text';;
        // },
        
        // firebaseに対して.dataabase()を実行してデータベースに接続
        // .ref('memos/' + this.user.uid)　で データを格納するパスを指定
        // .set(this.memos);　で指定したパスへデータを保存する

        // アコーディオン controlArea用
        toggleControlArea: function() {
            this.showControlArea = !this.showControlArea;
        },
        // アコーディオン controlArea用 イベント発生前
        onBeforeEnter: function(el) {
            el.style.height = 0;
        },
        // アコーディオン controlArea用 イベント発生時
        // el.scrollHeightで<transition>にラップされた部分（ここでは div.body）の高さを取得できる
        onEnter: function(el) {
            el.style.height = el.scrollHeight + 'px'
        },
        // アコーディオン controlArea用 イベント終了前
        onBeforeLeave: function(el) {
            el.style.height = el.scrollHeight + 'px'
        },
        // アコーディオン controlArea用 イベント終了時
        onLeave: function(el) {
            el.style.height = 0
        },
        // アコーディオン writeArea用
        toggleWriteArea: function() {
            this.showWriteArea = !this.showWriteArea;
        },
        // アコーディオン sampleArea用
        toggleSampleArea: function() {
            this.showSampleArea = !this.showSampleArea;
        },
    }
};
</script>

<!-- scopedをつけると自動的にhtmlの各タグに個別の属性値を割り当ててくれその属性値にのみCSSが効くようになる -->
<style lang="scss" scoped>

$areaHeight: 400px;
$areaHeightSample: 1000px;

.name {
    font-size: 1.8rem;
}
.logOut {
    margin: 2.8rem 0 3.6rem;
    button {
        font-size: 2rem;
        padding: .8rem 1.2rem;
        &:hover {
            color: #fff;
        }
    }
}


    .org_list {
        margin-bottom: 3rem;
    }

    .org_controlAreaWrap {
        cursor: pointer;
        margin: 0 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px dotted #ddd;
        width: 100%;
        .org_accordionHeader {
            height: 3rem;
            display: flex;
            justify-content: space-between;
            width: 100%;
            .org_icon {
                display: table-cell;
                line-height: 3rem;
                transform: rotate(0deg);
                transition-duration: 0.3s;
                &.rotate {
                    transform: rotate(180deg);
                    transition-duration: 0.3s;
                }
            }
        }
        .org_accordion {
            margin-top: 1rem;
            transition: 150ms ease-out;
        }
        .org_memoListArea {
            margin: 0;
            li {
                width: 100%;
                border-bottom: 1px dotted #ddd;
                margin: 0;
                text-align: left;
                &:first-child {
                    border-top: 1px dotted #ddd;   
                }
                p {
                    border: 3px solid #fff;
                    padding: .6rem;
                    width: 100%;
                    margin: 0;
                    font-size: 1.3rem;
                }
                p[data-selected="true"] {
                    border: 3px solid #d9d9d9;
                }
            }
        }
        .org_btnArea {
            // margin-top: 1.5rem;
            li {
                margin: 1.5rem 0 0;
                width: 100%;
                padding: 0 1rem;
                .btn {
                    width: 100%;
                    padding: 1rem .5rem;
                }
            }
        }
    }

.org_memo {
        margin-top: 3rem;
    
    .org_writeAreaWrap {
        .org_writeArea {
            width: 100%;
            border: 1px dotted #ddd;
            height: $areaHeight;
            padding: 1rem;
        }
    }
    .org_previewAreaWrap {
        .org_previewArea {
            width: 100%;
            border: 1px solid #ddd;
            height: $areaHeight;
            text-align: left;
            padding: 1rem;
            overflow: auto;
        }
    }
    .org_areaTitle {
        text-align: left;
        font-size: 2.5rem;
        padding: 0 .3rem .2rem;
    }
}

.org_memoSample {
    margin-top: 3rem;
    .org_writeAreaWrap {
        .org_writeArea {
            width: 100%;
            border: 1px dotted #ddd;
            height: $areaHeightSample;
            padding: 1rem;
        }
    }
    .org_previewAreaWrap {
        .org_previewArea {
            width: 100%;
            border: 1px solid #ddd;
            height: $areaHeightSample;
            text-align: left;
            padding: 1rem;
            overflow: auto;
        }
    }
    .org_areaTitle {
        text-align: left;
        font-size: 2.5rem;
        padding: 0 .3rem .2rem;
    }
}

    .org_slide-fade-enter-active {
      transition: all .3s ease;
    }
    .org_slide-fade-leave-active {
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .org_slide-fade-enter, 
    .org_slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateX(10px);
      opacity: 0;
    }

    .org_slide-fade-sample-enter-active {
      transition: all .3s ease;
    }
    .org_slide-fade--sample-leave-active {
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .org_slide-fade--sample-enter, 
    .org_slide-fade--sample-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateX(10px);
      opacity: 0;
    }




    /* Extra small devices: Phones (<768px) */
    @media (max-width: 991px) {
        .org_controlArea {
            li {
                margin-left: 0;
                margin-right: 0; 
            }
        }
        .org_writeAreaWrap {
            margin-top: 2rem;
            .org_writeArea {
                height: 300px;
            }
        }
        .org_previewAreaWrap {
            margin-top: 2rem;
            .org_previewArea {
                height: 300px;
            }
        }
    }


</style>
