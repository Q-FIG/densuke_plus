/**
 * イベント新規作成、再編集ページで実行する（/event、/edit2）
 * 画面表示時、候補日程の項目にオレンジ背景の要素を追加する
 */

// 定数
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

(() => {
  const rows = document.querySelectorAll('div.regist tr');
  let target = null;
  
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].querySelector('th').textContent == '候補日程') {
      target = rows[i].querySelector('td');
      break;
    }
  }
  
  if (target == null) {
    console.log('候補日程項目を取得できませんでした');
  
  } else {
    /**
     * 追加要素
     */
    const addArea =  document.createElement('dl');
    addArea.classList.add(['d-plus-area']);
  
    /**
     * label:まとめて日付を追加する
     */
    const addLabel = document.createElement('dt');
    addLabel.textContent = 'まとめて日付を追加する';
    addArea.appendChild(addLabel);
  
    /**
     * 日付の入力と実行ボタン
     */
    const addDateArea = document.createElement('dd');
    
    const addStartDate = document.createElement('input');
    addStartDate.type = 'date';
    addStartDate.id = 'customAddStartDate';
    addDateArea.appendChild(addStartDate);
  
    const addTo = document.createElement('span');
    addTo.textContent = '～';
    addDateArea.appendChild(addTo);
  
    const addEndDate = document.createElement('input');
    addEndDate.type = 'date';
    addEndDate.id = 'customAddEndDate';
    addDateArea.appendChild(addEndDate);
  
    const addInputButton = document.createElement('input');
    addInputButton.type = 'button';
    addInputButton.value = '追加する';
    addInputButton.style = 'margin-left:5px;';
    addInputButton.addEventListener('click', () => setDateListString());
    addDateArea.appendChild(addInputButton);
    
    addArea.appendChild(addDateArea);
    
    target.appendChild(addArea);
  }

  const explainArea = document.getElementsByName('explain')[0];

  const saveBtnArea = document.createElement('dl');
  saveBtnArea.className = 'd-plus-area';
  explainArea.after(saveBtnArea);

  const saveBtns = document.createElement('dd');
  saveBtnArea.appendChild(saveBtns);

  const saveBtn = document.createElement('input');
  saveBtn.type = 'button';
  saveBtn.value = '保存する';
  saveBtn.className = 'c-item';
  saveBtn.addEventListener('click', () => saveInputData());
  saveBtns.appendChild(saveBtn);

  const loadBtn = document.createElement('input');
  loadBtn.type = 'button';
  loadBtn.value = '保存したデータで上書きする';
  loadBtn.className = 'c-item';
  loadBtn.addEventListener('click', () => loadInputData());
  saveBtns.appendChild(loadBtn);
})();

/**
 * 指定した日付の追加処理を実行する
 */
function setDateListString() {
  const startDate = document.getElementById('customAddStartDate').valueAsDate;
  const endDate = document.getElementById('customAddEndDate').valueAsDate;

  let result = "";

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const formattedDate = `${d.getMonth() + 1}/${d.getDate()}(${daysOfWeek[d.getDay()]})`;
    result += formattedDate + "\n";  // 各日付を改行で区切る
  }

  const setArea = document.getElementById('schedule');
  setArea.value += result;
}

function saveInputData() {
  // JSON形式でデータを保存する
  const explain = document.getElementsByName('explain')[0].value;
  const data = { explain };
  localStorage.setItem('inputData', JSON.stringify(data));

  window.alert('保存しました：' + explain);
}

function loadInputData() {
  const savedData = localStorage.getItem('inputData');
  if (savedData) {
    const { explain } = JSON.parse(savedData);
    
    if (!window.confirm('イベント説明文は、以下で上書きされます。よろしいですか？\n' + explain)) {
      return null;
    }

    // 入力フィールドにデータを設定
    document.getElementsByName('explain')[0].value = explain;

    // 必要に応じて使えるように変数に格納
    return { explain };
  }
  return null;
}
