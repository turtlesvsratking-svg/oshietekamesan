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

// --- 3. 研究デザイン選択ナビ（💡 5つの選択肢・「最適デザイン:」への変更版） ---
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
        // 💡 追加デザインの結果表示
        html = `
            <div class="result-title"><i class="fa-solid fa-chart-line"></i> 最適デザイン：量的相関研究（相関分析・要因分析）</div>
            <p>2つ以上の要素が「一方が上がればもう一方も変化するか（相関）」や「原因と結果（因果）の傾向にあるか」をアンケートの数値データ等から分析する、看護研究で非常にメジャーなデザインです。</p>
        `;
    } else if (type === 'quantity-ana') {
        html = `
            <div class="result-title"><i class="fa-solid fa-flask"></i> 最適デザイン：準実験研究（前後比較デザイン）</div>
            <p>研修の実施や新しいケア手法の導入前後に、同じ評価（テストや指標）を行い、その介入効果を統計的に検証するアプローチです。</p>
        `;
    } else if (type === 'mixed') {
        // 💡 追加デザインの結果表示
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

// --- 4. 統計ナビロジック ---
let statsSelections = {};

function nextStatsStep(step, val) {
    if (step === 2) {
        statsSelections.type = val;
        document.getElementById('stats-q1').classList.add('hidden');
        
        if (val === 'category') {
            showStatsResult('chi-square');
        } else {
            document.getElementById('stats-q2-continuous').classList.remove('hidden');
        }
    }
}

function backStatsStep(step) {
    if (step === 1) {
        document.getElementById('stats-q2-continuous').classList.add('hidden');
        document.getElementById('stats-result').classList.add('hidden');
        document.getElementById('stats-q1').classList.remove('hidden');
    }
}

function showStatsResult(method) {
    document.getElementById('stats-q2-continuous').classList.add('hidden');
    const resultBox = document.getElementById('stats-result');
    resultBox.classList.remove('hidden');
    
    let html = '';
    if (method === 'chi-square') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：カイ二乗検定</div>
            <p>「性別によって希望する研修に差があるか」など、カテゴリー同士の比率の差を調べたい場合に最もよく使われる王道の統計手法です。</p>
        `;
    } else if (method === 't-test') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：t検定</div>
            <p>「研修前後のテストの点数の比較（対応あり）」や「A病棟とB病棟の平均年齢の比較（対応なし）」など、2つのグループの平均値の差を検証します。</p>
        `;
    } else if (method === 'anova') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：分散分析（ANOVA）</div>
            <p>3つ以上のグループの平均値に差があるかを調べます。有意差が出た場合は、どこに差があるかを特定する「多重比較」をセットで行います。</p>
        `;
    }
    
    html += `
        <button class="back-btn" style="margin-top:12px; display:block;" onclick="backStatsStep(1)"><i class="fa-solid fa-rotate-left"></i> 最初からやり連動する</button>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> EZRでの具体的な解析手順をブログで学ぶ
        </a>
    `;
    resultBox.innerHTML = html;
}
