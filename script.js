// --- 1. タブ切り替えロジック ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    const eventBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (eventBtn) eventBtn.classList.add('active');
}

// --- 2. ワード検索データベース & ロジック ---
const wordDatabase = [
    {
        keywords: ['pico', 'peco', 'ピコ', 'ペコ', '研究疑問'],
        title: 'PICO / PECO（研究疑問の定式化）',
        desc: '臨床の疑問を研究の問いに落とし込むフレームワーク。P(対象)、I/E(介入・要因)、C(比較)、O(結果)に整理してブレない計画を作ります。'
    },
    {
        keywords: ['質的研究', 'しつてき', 'インタビュー', '質的記述'],
        title: '質的研究（質的記述的アプローチ）',
        desc: '数字では表せない「患者さんの思い」や「看護師の経験・葛藤」を、インタビュー等の言葉を通じて深く探求するデザインです。'
    },
    {
        keywords: ['量的研究', 'りょうてき', '統計', 'アンケート', '数値'],
        title: '量的研究（実態調査・実験研究）',
        desc: '仮説を数値データや統計解析を用いて客観的に証明する研究。実態を追う記述研究や、効果を測る分析研究などがあります。'
    },
    {
        keywords: ['概念枠組み', 'がいねんわくぐみ', 'フレームワーク'],
        title: '概念枠組み（研究の全体像）',
        desc: '「研究がどのような理論や視点に基づいているか」を図や文章で示したもの。先行研究レビューを基に因果関係を整理する土台です。'
    },
    {
        keywords: ['倫理的配慮', 'りんり', '同意書', '個人情報'],
        title: '研究における倫理的配慮',
        desc: '対象者に不利益を与えないための絶対条件。自由意思による参加・撤回、匿名化などを明記し、倫理委員会の承認を得ます。'
    },
    {
        keywords: ['文献検討', 'ぶんけんけんとう', '先行研究', '医中誌'],
        title: '文献検討（先行研究の吟味）',
        desc: '医中誌等で過去の類似研究を調べる作業。「どこまでが明らかで、何が未解明か(研究の新規性)」を絞り込むために不可欠です。'
    },
    {
        keywords: ['考察', 'こうさつ', '結果の解釈'],
        title: '論文の「考察」の書き方',
        desc: '結果から何が言えるかを先行研究と比較しながら論理的に紐解く最重要パート。単なる感想にせず、看護実践への示唆を述べます。'
    }
];

function searchWord() {
    const input = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!input) {
        resultsContainer.innerHTML = '<p class="placeholder-text">キーワードを入力するか、タグをタップしてください。</p>';
        return;
    }

    const filtered = wordDatabase.filter(item => 
        item.title.toLowerCase().includes(input) || 
        item.desc.toLowerCase().includes(input) ||
        item.keywords.some(kw => kw.includes(input))
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<p class="placeholder-text">該当するワードが見つかりませんでした。別のキーワードを試してみてください。</p>';
        return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
        <div class="word-card">
            <h4><i class="fa-solid fa-book-bookmark"></i> ${item.title}</h4>
            <p>${item.desc}</p>
            <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-link">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> ブログで詳しい解説を見る
            </a>
        </div>
    `).join('');
}

function quickSearch(word) {
    document.getElementById('search-input').value = word;
    searchWord();
}

// --- 3. 研究デザイン選択ナビ（💡 新デザイン「実験研究」の追加と「最適デザイン:」への統一） ---
function selectDesign(type) {
    const resultBox = document.getElementById('design-result');
    resultBox.classList.remove('hidden');
    
    let html = '';
    if (type === 'quality') {
        html = `
            <div class="result-title"><i class="fa-solid fa-square-poll-horizontal"></i> 最適デザイン：質的研究（質的記述的アプローチ）</div>
            <p>個別のケースや、数字にできない主観的なプロセスを深く掘り下げるのに向いています。インタビューガイドの作成や倫理的配慮の検討から始めましょう。</p>
        `;
    } else if (type === 'quantity-desc') {
        html = `
            <div class="result-title"><i class="fa-solid fa-chart-pie"></i> 最適デザイン：量的記述研究（実態調査）</div>
            <p>現状の傾向や、何％の人が困っているか等の分布を横断的に調査して浮き彫りにするデザインです。信頼できる「既存の尺度(アンケート用紙)」が過去にあるか検索してみましょう。</p>
        `;
    } else if (type === 'quantity-rel') {
        html = `
            <div class="result-title"><i class="fa-solid fa-chart-line"></i> 最適デザイン：量的相関研究（相関分析・要因分析）</div>
            <p>2つ以上の要素が「一方が上がればもう一方も変化するか（相関）」や「原因と結果（因果）の傾向にあるか」をアンケートの数値データ等から分析する、看護研究で非常にメジャーなデザインです。</p>
        `;
    } else if (type === 'quantity-exp') {
        // 💡 追加：実験研究の結果表示
        html = `
            <div class="result-title"><i class="fa-solid fa-flask-vial"></i> 最適デザイン：実験研究（ランダム化比較試験：RCT / 非ランダム化比較試験）</div>
            <p>対象者をランダムに2群以上に割り振り、一方には新しいケアや治療を行い、もう一方には従来のケアを行うことで、外部要因を極限まで排除して効果を厳密に検証・証明する最もエビデンスレベルの高い量的研究デザインです。</p>
        `;
    } else if (type === 'quantity-ana') {
        html = `
            <div class="result-title"><i class="fa-solid fa-code-compare"></i> 最適デザイン：準実験研究（前後比較デザインなど）</div>
            <p>研修の実施や新しい看護ケアの導入前後に、同じ評価（テストや指標）を行い、その介入効果を統計的に検証するアプローチです。</p>
        `;
    } else if (type === 'mixed') {
        html = `
            <div class="result-title"><i class="fa-solid fa-layer-group"></i> 最適デザイン：混合研究法（Mixed Methods）</div>
            <p>数値による客観的な実態データ（量的データ）と、当事者の生の語り（質的データ）を組み合わせることで、研究の厚みと臨床への説得力を一気に高める先進的なアプローチです。</p>
        `;
    }
    
    html += `
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> このデザインの具体的な進め方をブログで確認
        </a>
    `;
    resultBox.innerHTML = html;
}

// --- 4. 統計ナビロジック（💡 多変量解析を網羅した動的3ステップ構造） ---
let statsSelections = {};

function nextStatsStep(step, val) {
    // 全て非表示にしてから進む
    if (step === 2) {
        statsSelections.dataType = val; // 'category' or 'continuous'
        document.getElementById('stats-q1').classList.add('hidden');
        document.getElementById('stats-q2').classList.remove('hidden');
    } else if (step === 3) {
        statsSelections.purpose = val; // 'compare' (差) or 'relation' (関連・要因)
        document.getElementById('stats-q2').classList.add('hidden');
        
        if (val === 'compare') {
            document.getElementById('stats-q3-compare').classList.remove('hidden');
        } else if (val === 'relation') {
            document.getElementById('stats-q3-relation').classList.remove('hidden');
        }
    }
}

function backStatsStep(currentStep) {
    // 戻るボタンの制御
    document.getElementById('stats-result').classList.add('hidden');
    if (currentStep === 1) {
        document.getElementById('stats-q2').classList.add('hidden');
        document.getElementById('stats-q1').classList.remove('hidden');
    } else if (currentStep === 2) {
        document.getElementById('stats-q3-compare').classList.add('hidden');
        document.getElementById('stats-q3-relation').classList.add('hidden');
        document.getElementById('stats-q2').classList.remove('hidden');
    }
}

function resetStats() {
    // 💡 変更：「もう一度判定する」用の初期化処理
    document.getElementById('stats-result').classList.add('hidden');
    document.getElementById('stats-q3-compare').classList.add('hidden');
    document.getElementById('stats-q3-relation').classList.add('hidden');
    document.getElementById('stats-q2').classList.add('hidden');
    document.getElementById('stats-q1').classList.remove('hidden');
    statsSelections = {};
}

function showStatsResult(method) {
    document.getElementById('stats-q3-compare').classList.add('hidden');
    document.getElementById('stats-q3-relation').classList.add('hidden');
    const resultBox = document.getElementById('stats-result');
    resultBox.classList.remove('hidden');
    
    let html = '';
    if (method === 'chi-square') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：カイ二乗検定（$\chi^2$ 検定）</div>
            <p>「性別（男性/女性）」と「疾患の有無（あり/なし）」のように、カテゴリーデータ同士の割合・比率の差に統計的有意差があるかを調べる王道の手法です。</p>
        `;
    } else if (method === 't-test') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：t検定（対応の有無に応じて選択）</div>
            <p>2つのグループの数値データの平均値を比較します。介入前後なら「対応のあるt検定」、独立した2病棟の比較なら「対応のないt検定」を選択します。</p>
        `;
    } else if (method === 'anova') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：分散分析（ANOVA）</div>
            <p>3つ以上のグループ（例：1年目・3年目・5年目看護師）における数値データの平均値の差を検証します。有意差がある場合は、どこに差があるかを特定する「多重比較検定」を併せて行います。</p>
        `;
    } else if (method === 'correlation') {
        // 💡 高度化：相関分析
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：相関分析（ピアソンの積率相関係数 / スピアマンの順位相関係数）</div>
            <p>2つの数値データ（例：勤務時間と睡眠時間）に連動性があるかを調べます。データの分布（正規分布）に合わせて、ピアソンかスピアマンの手法を選択します。</p>
        `;
    } else if (method === 'linear-regression') {
        // 💡 高度化：重回帰分析
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：重回帰分析（多変量解析）</div>
            <p>明らかにしたい結果（目的変数）が「数値スコア」であり、そこに影響を与えている複数の要因（説明変数）を同時に分析・予測する強力な統計手法です。</p>
        `;
    } else if (method === 'logistic-regression') {
        // 💡 高度化：多重ロジスティック回帰分析
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：多重ロジスティック回帰分析（多変量解析）</div>
            <p>明らかにしたい結果（目的変数）が「疾患の有無」や「退職の有無」といった2値（カテゴリーデータ）である場合に、どの要因がどれくらい発症やイベントに影響しているかをオッズ比を用いて分析する多変量解析の手法です。</p>
        `;
    } else if (method === 'survival-analysis') {
        // 💡 高度化：生存時間解析
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：生存時間解析（カプランマイヤー法 / コックス比例ハザードモデル）</div>
            <p>「退院までの日数」や「離職までの期間」のように、特定のイベントが発生するまでの【時間（期間）】を考慮して分析する手法です。2群比較にはログランク検定、複数要因の分析にはコックス比例ハザードモデルを用います。</p>
        `;
    }
    
    // 💡 変更：ボタン表現を「もう一度判定する」に、ブログ誘導から「EZRでの」を削除
    html += `
        <button class="back-btn" style="margin-top:12px; display:block; font-weight:700; color:var(--primary-color);" onclick="resetStats()"><i class="fa-solid fa-rotate-left"></i> もう一度判定する</button>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> 具体的な解析手順をブログで学ぶ
        </a>
    `;
    resultBox.innerHTML = html;
}
