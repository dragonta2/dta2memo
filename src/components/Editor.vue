<template>
    <div class="editor">
        <h1>エディター画面</h1>
        <!-- googleアカウント userデータ内のdisplayNameというキーに格納されたログイン名を取得 -->
        <p class="name">ユーザーネーム：{{ user.displayName }}</p>
        <p class="logOut"><button class="btn btn-outline-warning" @click="logout">ログアウト</button></p>
        <div class="row">
            <div class="listAreaWrap col-md-4">
                <h2 class="areaTitle">メモのリスト</h2>
                <ul class="memoListArea">
                    <!-- :data-selected="index == selectedIndex" メモのindexが現在選択されているものと一致した場合には動的にdata-selected="true"という属性がつくようになる -->
                    <li v-for="(memo, index) in memos" @click="selectMemo(index)">
                        <p v-if="memo.markdown" :data-selected="index == selectedIndex">{{ displayTitle(memo.markdown)}}</p>
                        <p v-if="!memo.markdown" :data-selected="index == selectedIndex">{{ displayNonTitle(memo.markdown) }}</p>
                    </li>
                </ul>
                <ul class="controlArea">
                    <li>
                        <button class="addMemoBtn btn btn-outline-info" @click="addMemo">メモの追加</button>
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
                        <button class="deleteMemoBtn btn btn-outline-info" v-on:click="deleteMemo">選択中のメモの削除</button>
                    </li>

                    <li>
                        <button class="saveMemoBtn btn btn-outline-info" v-on:click="saveMemos">メモの保存</button>
                    </li>
                </ul>
            </div>

                <!-- v-modelでinputやtextareaの状態をコンポーネントのデータmarkdownの中へ格納する データバインディング -->
                <div class="writeAreaWrap col-md-4">
                    <h2 class="areaTitle">記述エリア</h2>
                    <textarea class="writeArea" v-model="memos[selectedIndex].markdown" ref="markdown"></textarea>
                </div>
                <!-- v-htmlで指定されたpreview()関数の実行結果がHTMLとして描画される XSSの原因になるのでユーザー間で共有するようなものを作る場合は注意 -->
                <div class="previewAreaWrap col-md-4">
                    <h2 class="areaTitle">プレビューエリア</h2>
                    <div class="previewArea markdown-body" v-html="preview()"></div>
                </div>
            </div>
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
    
    data () {
        return {
            // メモを複数保存するための配列
            memos:[
                //markdownというキーにマークダウンで記述されたテキストが入る
                { markdown: sampleMarkdown }
            ],
            //編集・プレビューしているデータの配列番号（インデックス）が入る
            selectedIndex: 0,
            isSaving: false,
            nonTitleText: "No TEXT"
        };
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
        displayTitle: function(text) {
            return text.split(/\n/)[0].replace(/#+\s|-\s/, '');
        },
        displayNonTitle: function(text) {
            return this.nonTitleText;
        }
        //メモのタイトル（メモの1行目の文章） 改行箇所で分割して配列にする。その配列のはじめの値(インデックス番号 0)を返却する
        // displayTitle: function(text){
        //     return text.split(/\n/)[0].replace(/#+\s/, '') || 'no text';;
        // },
        
        // firebaseに対して.dataabase()を実行してデータベースに接続
        // .ref('memos/' + this.user.uid)　で データを格納するパスを指定
        // .set(this.memos);　で指定したパスへデータを保存する
        
    }
};
</script>

<!-- scopedをつけると自動的にhtmlの各タグに個別の属性値を割り当ててくれその属性値にのみCSSが効くようになる -->
<style lang="scss" scoped>
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

.listAreaWrap {
    cursor: pointer;
    .memoListArea {
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
                padding: 1rem .6rem;
                width: 100%;
                margin: 0;
            }
            p[data-selected="true"] {
                border: 3px solid #d9d9d9;
            }
        }
    }
    .controlArea {
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
.writeAreaWrap {
    .writeArea {
        width: 100%;
        border: 1px dotted #ddd;
        height: 500px;
        padding: 1rem;
    }
}
.previewAreaWrap {
    .previewArea {
        width: 100%;
        border: 1px solid #ddd;
        height: 500px;
        text-align: left;
        padding: 1rem;
        overflow: auto;
    }
}

.areaTitle {
    text-align: left;
    font-size: 2.5rem;
    padding: 0 .3rem .2rem;
}

/* Extra small devices: Phones (<768px) */
@media (max-width: 767px) {
    .controlArea {
        li {
            margin-left: 0;
            margin-right: 0; 
        }
    }
    .writeAreaWrap {
        margin-top: 1.5rem;
        .writeArea {
            height: 300px;
        }
    }
    .previewAreaWrap {
        margin-top: 1.5rem;
        .previewArea {
            height: 300px;
        }
    }

}
</style>


<!-- <style lang="scss" scoped>
.memoListWrapper {
    width: 19%;
    float: left;
    border-top: 1px solid #000;
}
.memoList {
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #000;
    &:nth-child(even) {
    }
        background-color: #ccf;
    }
}
    height: 1.5em;
    margin: 0;
    overflow: hidden;
}
.addMemoBtn {
    margin-top: 20px;
}
.markdown,
.preview {
    float: left;
    width: 40%;
.markdown {
}
.preview {
    text-align: left;
}
.deleteMemoBtn {
    margin: 10px;
}
</style> -->
