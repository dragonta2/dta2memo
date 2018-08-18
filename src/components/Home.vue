<template>
    <div id="home">
        <!-- <h1>{{ msg }}</h1> -->
        
        <div class="titleBox">
            <p class="main">DTA2MEMO</p>
            <p class="sub">マークダウン形式のメモ帳アプリ</p>
        </div>

        <p>マークダウン記法で書いた内容がリアルタイムにプレビュー</p>
        <p>googleアカウントをお持ちの方は、すぐにお使いいただけます</p>
        
        <p class="logIn">
            <button class="btn btn-outline-success" v-on:click="googleLogin"><i class="fa fa-google"></i>googleアカウントでログイン</button>
        </p>

        <div class="discriptionArea">
            <p>シンプルな機能でさっとメモをとることだけに集中出来ます。</p>
            <!-- <p>マークダウン記法で記入でき、リアルタイムにプレビュー</p> -->
            <p>ショートカットキーにより、キーボードだけでの操作が可能</p>
        </div>

        <div class="tableArea">
            <table class="noteBook">
                <thead>
                    <tr>
                    <th>機能</th>
                        <td class="data">Win</td>
                        <td class="data">Mac</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>保存</th>
                        <td class="data">control + S</td>
                        <td class="data">command + S</td>
                    </tr>
                    <tr><td class="bar" colspan="3"></td></tr>
                    <tr>
                        <th>メモの切り替え</th>
                        <td class="data">Alt + ↑↓</td>
                        <td class="data">option + S</td>
                    </tr>
                    <tr>
                        <td class="bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>メモの追加</th>
                        <td class="data">Control + ;</td>
                        <td class="data">command + ;</td>
                    </tr>
                    <tr>
                        <td class="bar" colspan="3"></td>
                    </tr>
                    <tr>
                        <th>メモの削除</th>
                        <td class="data">Control + Backspace</td>
                        <td class="data">command + delete</td>
                    </tr>
                </tbody>
            </table>
        </div>

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

.titleBox {
    width: 290px;
    height: 290px;
    padding: 3rem;
    // background-color: #333;
    background-color: #e5ba05;
    color: #fff;
    margin: 0 auto 4rem;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    .main {
        font-size: 3.8rem;
        padding-bottom: .5rem;
        border-bottom: 2px solid #fff;
    }
    .sub {
        font-size: 1.4rem;
        padding-top: .5rem;
    }
}

.discriptionArea {
    margin-top: 4rem;
}

.tableArea {
    width: 80%;
    margin: 4rem auto 0;
    .noteBook {
        width: 100%;
        margin: 0 auto;
        // width: 650px;
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
                &.data {
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
            
            &.data {
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
            &.bar {
                height: 1px;
                width: 100%;
                border-top: solid 1px #34495e;
                margin: 0;
                padding: 0;
            }
            // &:first-child {
            //     padding: 0 0 0 10px;
            //     vertical-align: middle;
            // }
        }
    }
}


@media (max-width: 991px) {
    .tableArea {
        .noteBook {
            thead {
                td {
                    &.data {
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
                &.data {
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
