<template>
    <div id="home" class="org_home">
        <!-- <h1>{{ msg }}</h1> -->
        
        <div class="org_titleBox">
            <h1 class="org_main">DTA2MEMO</h1>
            <p class="org_sub">マークダウン形式のメモ帳アプリ</p>
        </div>

        <p class="org_read">マークダウン記法で書いた内容をリアルタイムにプレビュー</p>
        <p>googleアカウントをお持ちの方は、すぐにお使いいただけます</p>
        
        <p class="org_logIn">
            <button class="btn btn-outline-success" v-on:click="googleLogin"><i class="fa fa-google"></i>googleアカウントでログイン</button>
        </p>

        <div class="org_discriptionArea">
            <p>シンプルな機能でさっとメモをとることだけに集中出来ます。</p>
            <!-- <p>マークダウン記法で記入でき、リアルタイムにプレビュー</p> -->
            <p>ショートカットキーにより、キーボードだけでの操作が可能</p>
        </div>

        <div class="org_tableArea">
            <table class="org_noteBook">
                <thead>
                    <tr>
                    <th>機能</th>
                        <td class="org_data">Win</td>
                        <td class="org_data">Mac</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="org_bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>保存</th>
                        <td class="org_data">control + S</td>
                        <td class="org_data">command + S</td>
                    </tr>
                    <tr><td class="org_bar" colspan="3"></td></tr>
                    <tr>
                        <th>メモの切り替え</th>
                        <td class="org_data">Alt + ↑↓</td>
                        <td class="org_data">option + S</td>
                    </tr>
                    <tr>
                        <td class="org_bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>メモの追加</th>
                        <td class="org_data">Control + ;</td>
                        <td class="org_data">command + ;</td>
                    </tr>
                    <tr>
                        <td class="org_bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>メモの削除</th>
                        <td class="org_data">Control + Backspace</td>
                        <td class="org_data">command + delete</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p class="org_logIn org_bottom">
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
@import '../scss/_quote.scss';

.org_home {
    margin-top: 2rem;
    text-align: center;
}

.org_logIn {
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

.org_titleBox {
    width: 290px;
    height: 290px;
    padding: 3rem;
    // background-color: #333;
    background-color: $themeColor;
    color: #fff;
    margin: 0 auto 4rem;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    font-family: $fontFam1;
    .org_main {
        font-size: 3.8rem;
        padding-bottom: .5rem;
        border-bottom: 2px solid #fff;
    }
    .org_sub {
        font-size: 1.4rem;
    }
}

.org_read {
    font-size: 2.6rem;
    font-family: $fontFam2;
}

.org_discriptionArea {
    margin-top: 4rem;
}

.org_tableArea {
    width: 80%;
    margin: 4rem auto 0;
    .org_noteBook {
        width: 100%;
        margin: 0 auto;
        border: none;
        border-top: solid 1px #666;
        border-bottom: solid 1px #666;
        border-collapse: separate;
        border-spacing: 0 10px;
        // background: #f5f5f5;
        background: #fcfcfc;
        text-align: center;
        thead {
            td {
                &.org_data {
                    font-weight: bold;
                    font-size: 1.8rem;
                }
            }
        }
        th,
        td {
            padding: 1.6rem 2rem;
        }
        th {
            width: 20%;
            vertical-align: middle;
            margin: 0;
            border-right: solid 1px #666;
            color: #333;
            font-size: 1.6rem;
            font-weight: bold;
            text-align: left;
        }
        td {
            
            &.org_data {
                width: 40%;
                padding-left: 6rem;
                margin: 0;
                border: none;
                color: #666;
                font-size: 1.5rem;
                vertical-align: middle;
                white-space: nowrap;
                overflow: hidden;
            }
            &.org_bar {
                height: 1px;
                width: 100%;
                border-top: solid 1px #34495e;
                margin: 0;
                padding: 0;
            }
        }
    }
}

.org_bottom {
    margin-top: 5rem;
}

@media (max-width: 991px) {
    .org_tableArea {
        .org_noteBook {
            thead {
                td {
                    &.org_data {
                        padding-right: 6rem;
                    }
                }
            }
            th {
                width: 100%;
                display: block;
                border-right: none;
                padding: 1rem 0 0 2rem;
            }
            td {
                &.org_data {
                    width: 100%;
                    display: block;
                    text-align: right;
                    padding-right: 4rem;
                    padding-bottom: 1rem;
                }
            }
        }
    }
}
</style>
