document.addEventListener('DOMContentLoaded', () => {
    const CMNT = document.body.querySelector('.comment');
    //commentクラスが存在したら
    if (CMNT) {

        //ここの配列に取得したID情報を記入します！
        const uniq = {
            gglFormID: '1FAIpQLSftdMz45xuZsCbcznvk-es2RrLI-2bi7D4nEnIGakrMv1lGzA',
            splSheetID: '13xzfi83A07TL28m3Cntp6d7fNCTjWSU226Z1cNo1Y88',
            urlKey: '1223514770',
            titleKey: '1695844770',
            nameKey: '150584391',
            commentKey: '240692857',
            idKey: '952610636',
            replyIdKey: '1429444280'
        }

        const FORM = document.getElementById('form');

        //コメントに必要な要素をformに追加（スパム対策）
        FORM.innerHTML = '<input name="name" placeholder="名前"><textarea name="comment" placeholder="コメント"  rows="5" maxlength="400"></textarea><div><button type="button">送信</button><span class="anchor"></span><input type="email" name="email" style="display:none;" title="スパム用"></div>';

        //HTML特殊文字をエスケープ
        const escapeHTML = (str) => {
            return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
        }

        //ランダムなアルファベット8文字を生成（ID用）
        const createRandomID = () => {
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let randStr = '';
            for (let i = 0; i < 8; i++) randStr += chars.charAt(Math.floor(Math.random() * chars.length));
            return randStr;
        }

        //スプレッドシートのCSVを2次元配列に変換
        const splCsvToArr = (csv) => {
            const arr = [];
            const rem = csv.substring(1, csv.length - 1);
            const rows = rem.split('"\n"');
            for (const row of rows) arr.push(row.split('","'));
            for (const num of [2, 3]) for (const col of arr) col[num] = col[num].replaceAll('""', '"');
            return arr;
        }

        const LIST = CMNT.querySelector('.list');
        const INFO = CMNT.querySelector('.info');
        const ANCH = FORM.querySelector('.anchor');
        const url = location.pathname;
        const query = encodeURIComponent(`select A, D, E, F, G where B = '${url}' order by A`); //Google Query関数を参照

        //スプレッドシートを読み込む
        const loadSplSheet = async () => {
            const response = await fetch(`https://docs.google.com/spreadsheets/d/${uniq.splSheetID}/gviz/tq?tqx=out:csv&tq=${query}&headers=0`); //headers=0で最初の列を除外
            if (response.ok) {
                const csv = await response.text();
                if (csv) {
                    const data = splCsvToArr(csv);
                    LIST.innerHTML = '';

                    //リストにコメントを表示
                    for (let i = 0; i < data.length; i++) {
                        let reply = '';
                        if (data[i][4]) {
                            const replyElem = document.getElementById(data[i][4]);
                            if (replyElem) reply = `<a class="reply" href="#${data[i][4]}">>>${replyElem.dataset.num}</a>`;
                            else reply = `<small class="reply">>>返信元のコメントは削除されたようです...</small>`;
                        }
                        LIST.innerHTML += `<li id="${data[i][3]}" data-num="${i + 1}"><div>${i + 1}.<b>${escapeHTML(data[i][1])}</b><small>${data[i][0]}</small><a href="#form"> 返信</a></div>${reply}<pre>${escapeHTML(data[i][2])}</pre></li>`;
                    }

                    //各コメントの返信をクリック
                    for (const a of LIST.querySelectorAll(`li > div > a`)) a.onclick = (e) => {
                        const li = e.target.parentNode.parentNode;
                        ANCH.innerHTML = `<i title="アンカーリンクを削除">Ⓧ</i><a href="#${li.id}" data-rep="${li.id}">>>${li.dataset.num}</a>`;
                        ANCH.querySelector('i').onclick = () => ANCH.innerHTML = '';
                    }

                } else LIST.innerHTML = '<div style="text-align:center;">コメントはまだありません</div>';
            } else INFO.textContent = '⚠ コメントの取得に失敗しました...時間をおいてリロードしてください。';
        }
        loadSplSheet();

        //送信ボタンをクリック
        FORM.querySelector('button').onclick = async (e) => {
            if (FORM.elements['email'].value) throw console.log('スパムを検出しました'); //罠のinputに値が入ってるとエラーになる
            const nVal = FORM.elements['name'].value;
            const cVal = FORM.elements['comment'].value;
            if (!nVal) throw alert('⚠ 名前の入力が空です');
            if (!cVal) throw alert('⚠ コメントの入力が空です');
            const blackWords = ['バカ', '馬鹿', '死ね', '","', '"\n"']; //禁止ワードを設定（最後の2つはsplCsvToArr用）
            if (blackWords.some((bw) => nVal.includes(bw))) throw alert('⚠ 名前に不適切なワードが含まれてます');
            if (blackWords.some((bw) => cVal.includes(bw))) throw alert('⚠ コメントに不適切なワードが含まれてます');
            e.target.setAttribute('disabled', 'true'); //ボタンを無効にして連続クリック防止
            const thisID = createRandomID();
            const title = encodeURIComponent(document.querySelector('h4').textContent); //記事のタイトルを取得
            const reply = FORM.querySelector('span > a')?.dataset.rep ?? '';

            //コメントデータをスプレッドシートに保存
            fetch(`https://docs.google.com/forms/d/e/${uniq.gglFormID}/formResponse`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `entry.${uniq.urlKey}=${url}&entry.${uniq.titleKey}=${title}&entry.${uniq.nameKey}=${encodeURIComponent(nVal)}&entry.${uniq.commentKey}=${encodeURIComponent(cVal)}&entry.${uniq.idKey}=${thisID}&entry.${uniq.replyIdKey}=${reply}`
            });
            INFO.textContent = 'ⓘ コメント投稿中...';

            // 2.5秒後にスプレッドシートを読み込んでリストに表示
            setTimeout(async () => {
                await loadSplSheet();
                e.target.removeAttribute('disabled'); //ボタン復活
                if (LIST.querySelector(`#${thisID}`)) {
                    INFO.textContent = 'ⓘ コメント成功！';
                    FORM.elements['comment'].value = '';
                    FORM.querySelector('span').innerHTML = '';
                }
                else INFO.textContent = '⚠ リロードしてコメントが正常に投稿されてるか確認してください。';
            }, 1000);
        }
    }
});