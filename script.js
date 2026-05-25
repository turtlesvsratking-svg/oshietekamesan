// ページ遷移システム
function showPage(pageId) {
    const pages = ['home', 'word', 'design', 'stats', 'theme'];
    pages.forEach(p => {
        document.getElementById(`page-${p}`).classList.add('hidden');
    });
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    window.scrollTo(0, 0);
}

// --- 1. ワード検索データ＆ロジック ---
const wordDatabase = [
    {
        keywords: ['pico', 'peco', 'ピコ'],
        title: 'PICO / PECO（研究疑問の定式化）',
        desc: '研究の問いを明確にするためのフレームワークです。P:患者、I:介入、C:比較、O:結果を整理することで、ブレない研究計画が立てられます。',
        url: 'https://kamesan-kamesan.com/'
    },
    {
        keywords: ['質的研究', 'しつてき'],
        title: '質的研究（質的記述的アプローチなど）',
        desc: '数字では表せない「患者さんの思い」や「看護師の経験・プロセス」を言葉（インタビューなど）を通して深く探求する研究デザインです。',
        url: 'https://kamesan-kamesan.com/'
    },
    {
        keywords: ['量的研究', 'りょうてき'],
        title: '量的研究（統計・アンケート）',
        desc: '仮説を数値データや統計解析を用いて客観的に証明する研究です。実態調査や、介入の効果判定などに広く使われます。',
        url: 'https://kamesan-kamesan.com/'
    },
    {
        keywords: ['倫理', 'インフォームドコンセント', '同意'],
        title: '研究における倫理的配慮',
        desc: '対象者の不利益にならないよう、自由意思による同意、個人情報の保護、研究目的以外の不使用などを計画書に明記し、倫理委員会の承認を得る必要があります。',
        url: 'https://kamesan-kamesan.com/'
    },
    {
        keywords: ['バイアス', '偏り'],
        title: 'バイアス（結果の偏り）',
        desc: '研究結果を歪めてしまう原因のことです。サンプルの偏りや、質問の仕方の偏りなどがあり、これらをできるだけ排除する工夫が必要です。',
        url: 'https://kamesan-kamesan.com/'
    }
];

function searchWord() {
    const input = document.getElementById('word-search-input').value.toLowerCase().trim();
    const resultBox = document.getElementById('word-result');
    
    if (input === "") {
        resultBox.classList.add('hidden');
        return;
    }

    const hit = wordDatabase.find(w => w.keywords.some(k => k.includes(input) || input.includes(k)));

    if (hit) {
        resultBox.innerHTML = `
            <h4>🐢 発見！【${hit.title}】</h4>
            <p>${hit.desc}</p>
            <a href="${hit.url}" target="_blank" class="blog-ref"><i class="fa-solid fa-arrow-up-right-from-square"></i> 「おしえてかめさん」の解説記事でもっと学ぶ</a>
        `;
        resultBox.classList.remove('hidden');
    } else {
        resultBox.innerHTML = `
            <h4>🐢 ごめんなさい</h4>
            <p>該当するワードがまだ登録されていません。「おしえてかめさん」のブログサイト内検索も試してみてくださいね。</p>
            <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-ref"><i class="fa-solid fa-magnifying-glass"></i> ブログで直接検索する</a>
        `;
        resultBox.classList.remove('hidden');
    }
}

function fillAndSearch(word) {
    document.getElementById('word-search-input').value = word;
    searchWord();
}

// --- 2. 研究デザイン診断 ---
function diagnoseDesign() {
    const q1 = document.getElementById('design-q1').value;
    const resultBox = document.getElementById('design-result');
    let title = "", desc = "";

    if (q1 === 'quality') {
        title = '質的記述的研究デザイン';
        desc = '対象者の生の語りや体験を丁寧にコード化し、カテゴリーに分類していく方法がおすすめです。新人看護師の心の葛藤や、特定の患者さんの闘病意欲などを捉えるのに最適です。';
    } else if (q1 === 'quantity_describe') {
        title = '量的・横断的記述研究（実態調査）',
        desc = 'アンケート（質問紙調査）を用いて、「〇〇を行っている看護師の割合」や「患者の満足度平均値」などを明らかにするデザインがおすすめです。';
    } else {
        title = '準実験研究（前後比較デザイン）';
        desc = '新しい看護ケアや指導パンフレットを導入する「前」と「後」で、患者さんの指標（知識量やインシデント数など）がどう変化したかを評価するデザインがおすすめです。';
    }

    resultBox.innerHTML = `
        <h4>🐢 おすすめのデザイン: ${title}</h4>
        <p>${desc}</p>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-ref"><i class="fa-solid fa-newspaper"></i> このデザインの計画書の書き方をブログで見る</a>
    `;
    resultBox.classList.remove('hidden');
}

// --- 3. 統計解析診断 ---
function diagnoseStats() {
    const q1 = document.getElementById('stats-q1').value;
    const q2 = document.getElementById('stats-q2').value;
    const resultBox = document.getElementById('stats-result');
    let title = "", desc = "";

    if (q1 === 'continuous' && q2 === 'two_groups') {
        title = 't検定 (t-test)';
        desc = '2つのグループの平均値に差があるかどうかを検証する、看護研究で最もよく使われる統計手法です（例：研修前後のテストの平均点比較）。';
    } else if (q1 === 'categorical' && q2 === 'two_groups') {
        title = 'カイ二乗検定 (χ²検定)';
        desc = '2つのグループにおける「割合や人数」に偏り・差があるかを検証します（例：A病棟とB病棟での転倒発生率の比較）。';
    } else if (q1 === 'continuous' && q2 === 'relation') {
        title = 'ピアソンの相関係数 / スピアマンの順位相関係数';
        desc = '2つの連続するデータ（例：自尊感情のスコアと燃え尽き症候群のスコア）の間に、正または負の関連性があるかを調べる手法です。';
    } else {
        title = 'クロス集計・ロジスティック回帰分析など';
        desc = 'カテゴリー同士の関連性を見る場合はクロス集計やカイ二乗検定、何が原因でそのイベント（転倒など）が起きたかの因果関係を探るには多変量解析が視野に入ります。';
    }

    resultBox.innerHTML = `
        <h4>🐢 おすすめの統計手法: ${title}</h4>
        <p>${desc}</p>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-ref"><i class="fa-solid fa-calculator"></i> 統計アレルギーでもわかる解説記事へ</a>
    `;
    resultBox.classList.remove('hidden');
}

// --- 4. 研究テーマ生成（擬似AIロジック） ---
function generateTheme() {
    const input = document.getElementById('theme-input').value.trim();
    const resultBox = document.getElementById('theme-result');

    if (!input) {
        alert('困りごとや気づきを入力してくださいね🐢');
        return;
    }

    // キーワードを少し抽出して研究テーマ風に変換する簡易ロジック
    const sampleKeywords = ['夜勤', 'インシデント', '指導', '不安', '患者', '看護師', 'ストレス'];
    let foundKeyword = "ケアの実施";
    
    for (let kw of sampleKeywords) {
        if (input.includes(kw)) {
            foundKeyword = kw;
            break;
        }
    }

    resultBox.innerHTML = `
        <h4>🐢 看護研究テーマの提案・変換案</h4>
        <p>あなたが挙げた課題から、以下のような研究テーマ（問い）の骨子はいかがでしょうか？</p>
        <ul style="margin: 1rem 0 1rem 1.5rem; text-align: left;">
            <li><strong>量的アプローチ：</strong>「病棟における${foundKeyword}に関連する要因の実態調査」</li>
            <li><strong>質的アプローチ：</strong>「中堅看護師が経験する${foundKeyword}における葛藤とそのプロセス」</li>
            <li><strong>実践・介入：</strong>「新しい指導モデルの導入が${foundKeyword}に与える効果の検証」</li>
        </ul>
        <p style="font-size:0.9rem; color:#666;">これらをベースに、PICO（誰に、何を、どう比較するか）を組み合わせてみましょう！</p>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-ref"><i class="fa-solid fa-pen-to-square"></i> テーマ決定から計画書作成までのロードマップはこちら</a>
    `;
    resultBox.classList.remove('hidden');
}
