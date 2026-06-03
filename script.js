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

// --- 3. 研究デザイン選択ナビ ---
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

// --- 4. 統計ナビロジック（💡 パラメトリック／ノンパラメトリック完全対応版） ---
let statsSelections = {};

function nextStatsStep(step, val) {
    if (step === 2) {
        statsSelections.dataType = val; // 'category' or 'continuous'
        document.getElementById('stats-q1').classList.add('hidden');
        document.getElementById('stats-q2').classList.remove('hidden');
    } else if (step === 3) {
        statsSelections.purpose = val; // 'compare' or 'relation'
        document.getElementById('stats-q2').classList.add('hidden');
        
        if (val === 'compare') {
            document.getElementById('stats-q3-compare').classList.remove('hidden');
        } else if (val === 'relation') {
            document.getElementById('stats-q3-relation').classList.remove('hidden');
        }
    }
}

// グループ比較系の選択時に呼び出される処理
function selectCompareGroup(groupType) {
    statsSelections.subType = groupType; // '2-group-paired', '2-group-unpaired', 'multi-group'
    
    // カテゴリーデータなら正規分布確認不要で即座にカイ二乗
    if (statsSelections.dataType === 'category') {
        showStatsResult('chi-square');
    } else {
        // 数値データならQ4（パラメトリック・ノンパラメトリック質問）を挟む
        document.getElementById('stats-q3-compare').classList.add('hidden');
        document.getElementById('stats-q4-normality').classList.remove('hidden');
    }
}

// 関係性（相関など）の選択時に呼び出される処理
function selectRelationType(relType) {
    statsSelections.subType = relType; // 'correlation'
    
    if (statsSelections.dataType === 'category') {
        showStatsResult('chi-square'); // カテゴリー同士の相関的な位置付け
    } else {
        // 相関分析もパラメトリック・ノンパラの分岐が必要なのでQ4へ
        document.getElementById('stats-q3-relation').classList.add('hidden');
        document.getElementById('stats-q4-normality').classList.remove('hidden');
    }
}

// Q4で正規分布の性質をセットした際の最終判定ロジック
function setNormality(normType) {
    statsSelections.normality = normType; // 'parametric' or 'non-parametric'
    document.getElementById('stats-q4-normality').classList.add('hidden');
    
    const sub = statsSelections.subType;
    
    if (sub === '2-group-paired') {
        // 2群（対応あり・前後比較など）
        showStatsResult(normType === 'parametric' ? 't-test-paired' : 'wilcoxon');
    } else if (sub === '2-group-unpaired') {
        // 2群（対応なし・2病棟比較など）
        showStatsResult(normType === 'parametric' ? 't-test-unpaired' : 'mann-whitney');
    } else if (sub === 'multi-group') {
        // 3群以上比較
        showStatsResult(normType === 'parametric' ? 'anova' : 'kruskal-wallis');
    } else if (sub === 'correlation') {
        // 相関分析
        showStatsResult(normType === 'parametric' ? 'pearson' : 'spearman');
    }
}

// 「戻る」ボタンの細やかな制御
function backStatsStep(currentStep) {
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

function backToQ3() {
    document.getElementById('stats-q4-normality').classList.add('hidden');
    if (statsSelections.purpose === 'compare') {
        document.getElementById('stats-q3-compare').classList.remove('hidden');
    } else {
        document.getElementById('stats-q3-relation').classList.remove('hidden');
    }
}

function resetStats() {
    document.getElementById('stats-result').classList.add('hidden');
    document.getElementById('stats-q4-normality').classList.add('hidden');
    document.getElementById('stats-q3-compare').classList.add('hidden');
    document.getElementById('stats-q3-relation').classList.add('hidden');
    document.getElementById('stats-q2').classList.add('hidden');
    document.getElementById('stats-q1').classList.remove('hidden');
    statsSelections = {};
}

// 最終結果表示
function showStatsResult(method) {
    // 全ての質問ボックスを隠す
    document.getElementById('stats-q1').classList.add('hidden');
    document.getElementById('stats-q2').classList.add('hidden');
    document.getElementById('stats-q3-compare').classList.add('hidden');
    document.getElementById('stats-q3-relation').classList.add('hidden');
    document.getElementById('stats-q4-normality').classList.add('hidden');
    
    const resultBox = document.getElementById('stats-result');
    resultBox.classList.remove('hidden');
    
    let html = '';
    
    // --- 各統計手法の解説出力定義 ---
    if (method === 'chi-square') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：カイ二乗検定（$\chi^2$ 検定）</div>
            <p>「性別（男性/女性）」と「疾患の有無（あり/なし）」のように、カテゴリーデータ同士の割合・比率の差に統計的有意差があるかを調べる王道の手法です。</p>
        `;
    } else if (method === 't-test-paired') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：対応のある t 検定【パラメトリック】</div>
            <p>データが正規分布（左右対称）しており、同じグループの介入前後などで「数値の平均値」に差があるかを厳密に検証するのに最適な統計手法です。</p>
        `;
    } else if (method === 'wilcoxon') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：ウィルコクソンの符号付順位検定【ノンパラメトリック】</div>
            <p>同じグループの前後比較ですが、データの人数が少ない場合や、データのバラつきに偏り（正規分布していない）がある場合に選択する、信頼性の高いノンパラメトリック手法です。</p>
        `;
    } else if (method === 't-test-unpaired') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：対応のない t 検定【パラメトリック】</div>
            <p>データが正規分布しており、独立した異なる2つのグループ（例：A病棟とB病棟）の間で「数値の平均値」に差があるかをクリアに検証する手法です。</p>
        `;
    } else if (method === 'mann-whitney') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：マン・ホイットニーのU検定【ノンパラメトリック】</div>
            <p>独立した異なる2つのグループの比較において、人数が極端に少ない場合や、データの偏りが大きい場合に平均値ではなく「順位和」を基礎に差を安全に検証する手法です。</p>
        `;
    } else if (method === 'anova') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：分散分析（ANOVA）【パラメトリック】</div>
            <p>3つ以上のグループ（例：1年目・3年目・5年目の看護師）における数値データの平均値の差を検証します。有意差がある場合は、どこに差があるかを特定する「多重比較検定」を併せてセットで行います。</p>
        `;
    } else if (method === 'kruskal-wallis') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：クラスカル・ウォリス検定【ノンパラメトリック】</div>
            <p>3つ以上のグループを比較する際、人数が少なかったり偏りがある場合に用いるノンパラメトリック版の分散分析です。有意差検定後はノンパラ対応の多重比較を行います。</p>
        `;
    } else if (method === 'pearson') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：ピアソンの積率相関係数【パラメトリック】</div>
            <p>2つの数値データ（例：勤務時間と睡眠時間）に、きれいな直線的な比例・反比例の関係（相関）があるかを調べる最も一般的な相関分析手法です。</p>
        `;
    } else if (method === 'spearman') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：スピアマンの順位相関係数【ノンパラメトリック】</div>
            <p>2つのデータの間に関係性があるかを調べる際、データが正規分布していない場合や、順位（ランキングデータ・順序尺度）のような性質のデータを扱う場合に最適な相関分析です。</p>
        `;
    } else if (method === 'linear-regression') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：重回帰分析（多変量解析）</div>
            <p>明らかにしたい結果（目的変数）が「数値（ストレススコアなど）」であり、そこに影響を与えている複数の要因（年齢、残業時間、夜勤回数など）の重みや影響度を同時に予測・特定する強力な統計分析手法です。</p>
        `;
    } else if (method === 'logistic-regression') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：多重ロジスティック回帰分析（多変量解析）</div>
            <p>明らかにしたい結果（目的変数）が「疾患の有無」や「退職の有無」といった2値（はい/いいえ）である場合に、複数の要因がどれくらいその発生に影響しているかを【オッズ比】を用いて鮮明に導き出す多変量解析手法です。</p>
        `;
    } else if (method === 'survival-analysis') {
        html = `
            <div class="result-title"><i class="fa-solid fa-calculator"></i> 最適な統計手法：生存時間解析（ログランク検定 / コックス比例ハザードモデル）</div>
            <p>「新人看護師が離職するまでの期間」や「褥瘡が治癒するまでの日数」のように、イベントが発生するまでの【時間・期間】を考慮する高度な解析手法です。2群比較ならカプランマイヤー曲線＋ログランク検定、複数要因の分析ならコックス比例ハザードモデルを選択します。</p>
        `;
    }
    
    // 💡 ボタン表現の変更、および「EZRでの」の削除反映済み
    html += `
        <button class="back-btn" style="margin-top:12px; display:block; font-weight:700; color:var(--primary-color);" onclick="resetStats()"><i class="fa-solid fa-rotate-left"></i> もう一度判定する</button>
        <a href="https://kamesan-kamesan.com/" target="_blank" class="blog-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> 具体的な解析手順をブログで学ぶ
        </a>
    `;
    resultBox.innerHTML = html;
}
