<template>
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
</template>

<script>
export default {
    name: 'shortcut',//今回つかってなさそう
    data () {
        return {
            msg: 'ショートカットキー一覧'
        };
    }
};
</script>

<style lang="scss" scoped>
@import '../scss/_quote.scss';


.org_noteBook {
    width: 100%;
    margin: 0 auto;
    border: none;
    border-top: solid 2px;
    border-bottom: solid 2px;
    border-color: lighten(#666, 30%);// 明度を明るくする %で指定
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

@media (max-width: 991px) {
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
</style>
