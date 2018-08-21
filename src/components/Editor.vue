<template>
    <div class="org_editor">
    
        <header class="org_header row">
            <div class="org_titleBox">
                <h1 class="org_main">DTA2<br>MEMO</h1>
            </div>
            <!-- googleアカウント userデータ内のdisplayNameというキーに格納されたログイン名を取得 -->
            <ul>
                <li class="org_logOut"> 
                    <button class="btn btn-outline-warning org_bsBtnCustom" @click="logout">ログアウト</button>
                </li>
                <li class="org_name"> 
                    <p>ユーザーネーム：{{ user.displayName }}</p>
                </li>
            </ul>
        </header>
        

        <div class="org_list row">
            <div class="org_controlAreaWrap">
                <div class="org_accordionHeader" v-on:click="toggleControlArea">
                    <p class="org_areaTitle">メモのリスト</p>
                    <i class="fa fa-lg fa-angle-down org_icon" v-bind:class="{ rotate: showControlArea }"></i>
                </div>
                <transition name="org_slide-fade-up">
                    <div class="org_controlArea" v-show="showControlArea">
                        <ul class="org_memoListArea">
                            <!-- :data-selected="index == selectedIndex" メモのindexが現在選択されているものと一致した場合には動的にdata-selected="true"という属性がつくようになる -->
                            <li v-for="(memo, index) in memos" @click="selectMemo(index)" v-if="memo.markdown">
                                <p :data-selected="index == selectedIndex">{{ displayTitle(memo.markdown)}}</p>
                                <!-- 記述エリアに何も書かれていなかったら data:内の nonTitleText: "No TEXT" を返す-->
                                <p v-if="!memo.markdown" :data-selected="index == selectedIndex">{{ displayNonTitle(memo.markdown) }}</p>
                            </li>
                        </ul>
                        <ul class="org_btnArea">
                            <li>
                                <button class="org_addMemoBtn org_btn org_btn_standard" v-on:click="addMemo">メモの追加</button>
                            </li>

                            <li>
                                <button class="org_saveMemoBtn org_btn org_btn_standard" v-on:click="saveMemos">メモの保存</button>
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
                                <button class="org_deleteMemoBtn org_btn org_btn_attention" v-on:click="deleteMemo">選択中のメモの削除</button>
                            </li>
                        </ul>
                    </div><!-- .org_controlArea -->
                </transition>
            </div><!-- /.org_controlAreaWrap -->
        </div><!-- /.org_list -->
        
        <div class="org_toggleCssBox">
            <input type="checkbox" id="label1" />
            <label for="label1" v-on:click="toggleWriteArea"><i class="org_iconPen fa fa-pencil-square-o"></i><span>WRITE AREA</span>
            </label>
        </div><!-- /.org_toggleCssBox -->

        <div class="org_memo row">
            <!-- v-modelでinputやtextareaの状態をコンポーネントのデータmarkdownの中へ格納する データバインディング -->
            <transition name="org_slide-fade">
                <div class="org_writeAreaWrap col-lg-7" v-show="showWriteArea">
                    <h2 class="org_areaTitle">WRITE AREA</h2>
                    <textarea class="org_writeArea" v-model="memos[selectedIndex].markdown" ref="markdown"></textarea>
                </div>
            </transition>

            <!-- v-htmlで指定されたpreview()関数の実行結果がHTMLとして描画される XSSの原因になるのでユーザー間で共有するようなものを作る場合は注意 -->
            <!-- 三項演算子でclassの付与を振り分け -->
            <div class="org_previewAreaWrap" v-bind:class="[showWriteArea === true ?'col-lg-5' : 'col-lg-12']">
                <h2 class="org_areaTitle">PREVIEW AREA</h2>
                <div class="org_previewArea markdown-body" v-html="preview()"></div>
            </div>
        </div><!-- /.org_memo -->

            <div class="org_toggleCssBox">
                <input type="checkbox" id="label2" />

                <label for="label2" v-on:click="toggleSampleArea"><i class="org_iconCode fa fa-code"></i><span>SAMPLE AREA</span>
                </label>
            </div><!-- /.org_toggleCssBox -->

        <div class="org_memoSample">
            <!-- v-modelでinputやtextareaの状態をコンポーネントのデータmarkdownの中へ格納する データバインディング -->
            <transition name="org_slide-fade-up">
                <div class="org_accordionSample row" v-show="showSampleArea">
                    <div class="org_writeAreaWrap col-lg-7">
                            <h2 class="org_areaTitle">SAMPLE WRITE AREA</h2>
                            <textarea class="org_writeArea" v-model="memos[0].markdown" ref="markdown"></textarea>
                    </div>
                    <!-- v-htmlで指定されたpreview()関数の実行結果がHTMLとして描画される XSSの原因になるのでユーザー間で共有するようなものを作る場合は注意 -->
                    <div class="org_previewAreaWrap col-lg-5">
                        <h2 class="org_areaTitle">SAMPLE PREVIEW AREAW </h2>
                        <div class="org_previewArea markdown-body" v-html="previewSample()"></div>
                    </div><!-- /.org_previewAreaWrap -->
                </div>
            </transition>
        </div><!-- /.org_memoSample -->
    </div>
</template>

<script>
//npmでインストールしたマークダウン書式 → HTML変換してくれるnpmモジュールのmarkedを import 登録したい名前 from '読み込みたいモジュール名' これで登録して読み込む

// import marked from 'marked';
import markdown from '../lib/markdown';
// src/assets/sample.jsに書かれているサンプル用の記述を「sampleMarkdown」という名前で呼び出し
import sampleMarkdown from '../assets/sample_text';


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
                 // markdownというキーの中にマークダウンで記述されたテキストが値として入る

                 // import sampleMarkdown from '../assets/sample';　これをmemos.markdown[0]として出力
                 { markdown: sampleMarkdown }
             ],
             // 編集・プレビューしているデータの配列番号（インデックス）が入る
             selectedIndex: 0,
             isSaving: false,
             nonTitleText: "No TEXT",
             // アコーディオン用
             showControlArea: false,
             showWriteArea: true,
             showSampleArea: true,
        }
    }, 
    //ライフサイクルフック コンポーネント作成時に実行される
    created: function(){
        // firebaseに対して.dataabase()を実行してデータベースに接続
        firebase
        //DBへの接続
        .database()
        // .ref('memos/' + this.user.uid)　で データを格納するパスを指定
        .ref('memos/' + this.user.uid)
        //1回だけの読み込み
        .once('value')
        //次に定義した関数が結果とともに読み込まれる .then(result => {} → promise形式でデータを受信 データの読み込みが終わり次第 then内に定義した関数が結果ととともに読み込まれる 
        .then(result => {
            // result.val() → 指定のパスのデータを取得
            //はじめて作成された時は結果がnullなのでif文で追加データがあった場合のみにmemosを上書きする
            if(result.val()){
                this.memos = result.val();
                // this.focusMemo();
            }
        });
    },
    //ライフサイクルフック コンポーネントの描画完了時
    // mounted: function(){
    //     this.focusMemo(); 
    //     document.onkeydown = e => {
    //         // 関数内のeはキーボードの押下されたイベント自体で、そのイベントの.metaKeyでControlキーが押されているかチェック、e.keyで同時にsキーも押されているかチェックしている。
    //         // var skey = event.keyCode(83);
    //         if(e.key == 's' && e.metaKey){
    //             this.saveMemos();
    //             return false;
    //         }
    //     };
    // },
    mounted: function(){
        // this.focusMemo(); 
        document.onkeydown = e => {
            // 関数内のeはキーボードの押下されたイベント自体で、そのイベントの.metaKeyでControlキーが押されているかチェック、e.keyで同時にsキーも押されているかチェックしている。
            // var skey = event.keyCode(83);
            if(e.key == 's' && e.metaKey){
                this.saveMemos();
                return false;
            } if (e.key ==  'Backspace' && e.metaKey){
                this.deleteMemo();
                return false;
            } if (e.key ==  ';' && e.metaKey){
                this.addMemo();
                return false;
            } if (e.key ==  'ArrowUp' && e.altKey){
                if (this.selectedIndex > 0 && this.memos.length > 0) {
                    this.selectMemo(this.selectedIndex - 1);
                    return false;
                }
                // this.selectMemo(this.selectedIndex - 1);
            } if (e.key ==  'ArrowDown' && e.altKey){
                if (this.selectedIndex < this.memos.length - 1) {
                    this.selectMemo(this.selectedIndex + 1);
                    return false;
                }
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
            // this.focusMemo();
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
                    // this.selectedIndex--;
                    //もし選択されているインデックス番号が0よりも大きかったら
                    if (this.selectedIndex > 0) {
                        // 選択されているインデックス番号から1マイナスする
                        this.selectedIndex--;
                    }
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
                // .set(this.memos);　で指定したパスへデータを保存する
                .set(this.memos)
                .then(res => {
                    this.isSaving = false;
            });
        },
        // 発火された（この場合クリック）配列のindex番号を取得してselectedIndexに代入
        selectMemo: function(index){
            this.selectedIndex = index;
            // this.focusMemo();
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
        //メモのタイトル（メモの1行目の文章） 改行箇所で分割して配列にする。その配列のはじめの値(インデックス番号 0)を返却する
        // displayTitle: function(text){
        //     return text.split(/\n/)[0].replace(/#+\s/, '');
        // },
        displayTitle: function(text) {
            return text.split(/\n/)[0].replace(/#+\s|-\s/, '');
        },
        displayNonTitle: function(text) {
            return this.nonTitleText;
        },
        
        // アコーディオン controlArea用
        toggleControlArea: function() {
            this.showControlArea = !this.showControlArea;
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
    // computed: {
    //     plusHeight: function() {
    //         return 
    //     }
    // }
};
</script>

<!-- scopedをつけると自動的にhtmlの各タグに個別の属性値を割り当ててくれその属性値にのみCSSが効くようになる -->
<style lang="scss" scoped>
@import '../scss/_quote.scss';

$areaHeight: 800px;
$areaHeightSample: 1200px;

.org_header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .org_titleBox {
        width: 8rem;
        height: 8rem;
        padding: 0 1rem;
        background-color: $themeColor;
        color: #fff;
        text-align: center;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: $fontFam1;
        .org_main {
            font-size: 1.6rem;
            // font-weight: bold;
            margin: 0;
            // padding-bottom: .5rem;
            // display: inline-block;
            // vertical-align: middle;
            // border-bottom: 2px solid #fff;
        }
        // .sub {
        //     font-size: 1.2rem;
        //     padding-top: .5rem;
        // }
    }
    ul {
        display: flex;
        flex-direction: column;
        // align-content: space-between;
        align-items: flex-end;
        margin: 0;
        li {
            margin: 0;
            &.org_logOut {
                margin: 0;
                .org_btn {
                    font-size: 1.4rem;
                    padding: .5rem 1rem .3rem;
                    &:hover {
                        color: #fff;
                    }
                }
            }
            &.org_name {
                font-size: 1.4rem;
                margin-top: 1.8rem;
                p {
                    margin: 0;
                }
            }
        }
    }
}

.org_list {
    background-color: #000;
    color: #fff;
    margin-bottom: 4rem;
    .org_controlAreaWrap {
        cursor: pointer;
        // margin: 2rem;
        // border-bottom: 1px dotted #ddd;
        width: 100%;
        .org_accordionHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 1.5rem 1.5rem;
            .org_areaTitle {
                margin: 0;
                font-size: 1.6rem;
            }
            .org_icon {
                transform: rotate(0deg);
                transition-duration: 0.3s;
                &.rotate {
                    transform: rotate(180deg);
                    transition-duration: 0.3s;
                }
            }
        }
        .org_controlArea {
            transition: 150ms ease-out;
            background-color: #2F2F2F;
            padding-bottom: 1.5rem;
            box-sizing: border-box;
            .org_memoListArea {
                margin: 0;
                li {
                    width: 100%;
                    border-bottom: 1px dotted;
                    border-bottom-color: #ddd;
                    // border-bottom-color: $themeColor;
                    margin: 0;
                    text-align: left;
                    &:first-child {
                        // border-top: 1px dotted #ddd;
                        border-top: none;
                        border-top-color: $themeColor;
                    }
                    p {
                        padding: .8rem 1rem .6rem;
                        width: 100%;
                        margin: 0;
                        font-size: 1.2rem;
                        border: 4px solid #2F2F2F;
                        box-sizing: border-box;
                    }
                    p[data-selected="true"] {
                        border: 4px solid;
                        // border-color: #d9d9d9;
                        border-color: #ddd;
                        // border-color: $themeColor;
                    }
                }
            }
        }
        .org_btnArea {
            margin-top: 1rem;
            li {
                margin: 1.5rem 0 0;
                width: 100%;
                padding: 0 1rem;
            }
        }
    }
}


.org_toggleCssBox {
    border-top: 1px solid #777;
    border-bottom: 1px solid #777;
    padding: .6rem 2rem .2rem;
    box-sizing: border-box;
    color: #777;
    /*チェックボックスは見えなくする*/
    input {
        display: none;
        /*クリックで中身表示*/
        &:checked ~ label:after {
            content: '\f204';
        }
    }
    label {
        transition: .5s;
        text-align: center;
        display: block;
        cursor: pointer;
        &:after {
            display: inline-block;
            content: '\f205';
            font-family: 'FontAwesome';
            padding-left: .6rem;
            font-size: 2.4rem;
            vertical-align: middle;
        }
        .org_iconPen {
            margin-right: .5rem;
            font-size: 2.5rem;
            vertical-align: middle;
        }
        .org_iconCode {
            margin-right: .5rem;
            font-size: 2rem;
            vertical-align: text-bottom;
        }
        span {
            vertical-align: middle;
            font-size: 1.5rem;
        }
    }
}

.org_memo {
    margin: 4rem 0; 
    .org_writeAreaWrap {
        .org_writeArea {
            width: 100%;
            // border: 1px dotted #ddd;
            border: 1px dotted;
            border-color: $themeColor;
            border-top: none;
            height: $areaHeight;
            padding: 1.4rem;
            &:focus {
                outline: none;
            }
        }
    }
    .org_previewAreaWrap {
        .org_previewArea {
            width: 100%;
            // border: 1px solid #ddd;
            border: 1px solid;
            border-color: $themeColor;
            border-top: none;
            height: $areaHeight;
            text-align: left;
            padding: 1.4rem;
            overflow: auto;
        }
    }
    .org_areaTitle {
        text-align: left;
        font-size: 2.4rem;
        font-weight: bold;
        color: #fff;
        padding: 1rem 1.4rem .6rem;
        margin-bottom: 0;
        background-color: $themeColor;
    }
}

.org_memoSample {
    margin-top: 4rem;
    .org_writeAreaWrap {
        .org_writeArea {
            width: 100%;
            // border: 1px dotted #ddd;
            border: 1px dotted;
            border-color: $themeSubColor;
            border-top: none;
            height: $areaHeightSample;
            padding: 1.4rem;
            outline: none;
        }
    }
    .org_previewAreaWrap {
        .org_previewArea {
            width: 100%;
            // border: 1px solid #ddd;
            border: 1px solid;
            border-color: $themeSubColor;
            border-top: none;
            height: $areaHeightSample;
            text-align: left;
            padding: 1.4rem;
            overflow: auto;
        }
    }
    .org_areaTitle {
        text-align: left;
        font-size: 2rem;
        font-weight: bold;
        color: #fff;
        padding: 1rem 1.4rem .6rem;
        margin-bottom: 0;
        background-color: $themeSubColor;
    }
}

//transion用の指定
// transition nameにつけた名前でトランジションクラスの名前も変更可能
// 例）.v-enter-acitive ➡︎ .org_slide-fade-enter-active(.v-より前がつけたnameに入れ替わる)
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

.org_slide-fade-up-enter-active {
  transition: all 1s ease;
}
.org_slide-fade-up-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.org_slide-fade-up-enter, 
.org_slide-fade-up-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}


/* width 991px 以下の場合この指定が効く */
@media (max-width: 991px) {
    .org_controlArea {
        li {
            margin-left: 0;
            margin-right: 0; 
        }
    }
    .org_memo {
        .org_writeAreaWrap {
            .org_writeArea {
                height: 300px;
            }
        }
        .org_previewAreaWrap {
            margin-top: 1rem;
            .org_previewArea {
                height: 300px;
            }
        }
    }
    .org_memoSample {
        .org_previewAreaWrap {
            margin-top: 1rem;
        }
    }
}

</style>
