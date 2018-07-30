import marked from 'marked';
marked.setOptions({
  breaks: true,
});

export default function(text){
  return marked(text)
    //「g」一致するすべての文字を検索、指定なしの場合は最初の1つだけ検索。「i」… アルファベット大文字小文字の区別をしない。
    .replace(/\[ \]/gi, '<input type="checkbox">')
    .replace(/\[x\]/gi, '<input type="checkbox" checked="checked">');
}
