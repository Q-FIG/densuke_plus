/**
 * イベント新規作成、再編集ページで実行する（/event、/edit2）
 * 画面表示時、候補日程の項目にオレンジ背景の要素を追加する
 */

// 定数
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  console.log('拡張機能により、日付入力を追加します');

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
    const addDateArea = document.createElement('dt');
    
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