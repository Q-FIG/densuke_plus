/**
 * イベント画面
 * ・入力済み予定のコピペ
 * ・平日・祝日のみに予定を入力
 */

// 祝日を取得する
// import holiday_jp from '@holiday-jp/holiday_jp';
// let holiday_jp = require('@holiday-jp/holiday_jp');
// fetch('https://trusted-source.com/script.js')
//   .then(response => response.text())
//   .then(code => {
//     // スクリプトの内容をFunctionコンストラクタで実行
//     const executeScript = new Function(code);
//     executeScript();
//   })
//   .catch(error => console.error('外部スクリプトの読み込みに失敗しました', error));

// 定数
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const bulkInsertList = [...daysOfWeek, "平日", "土日"];
// const bulkInsertList = [...daysOfWeek, "平日", "土日", "祝日"];
const customBulkWeeks = {
  "平日": ["月", "火", "水", "木", "金"],
  "土日": ["土", "日"]
};
const bulkBtns = {
  1: '×',
  2: '△',
  3: '○',
  4: '◎'
};

// 変数
let selectedBulkInsertModeNum = "";
let cBulkFlgCheck = false;

(() => {
  // 追加エリア
  const bulkarea = document.getElementById('bulkarea');

  // 以下、追加分
  const addArea =  document.createElement('details');
  addArea.className = 'd-plus-area';

  // 追加分タイトル
  const summary = document.createElement('summary');
  summary.textContent = '【拡張分】曜日指定で、一括で変更する';
  // summary.textContent = '【拡張分】曜日・祝日指定で、一括で変更する';
  addArea.appendChild(summary);

  // 選択肢
  const selectMode = document.createElement('select');
  selectMode.addEventListener('change', function(event) {
    // console.log(`選択したモードが、「${selectedBulkInsertModeNum}」から「${event.target.value}」に変更されます`);
    selectedBulkInsertModeNum = event.target.value;
  });
  
  // 選択要素の追加
  const option_selectMode_0 = document.createElement('option');
  option_selectMode_0.value = "";
  option_selectMode_0.textContent = '曜日を選択';
  selectMode.appendChild(option_selectMode_0);

  for (let i = 0; i < bulkInsertList.length; i++) {
    const option_selectMode = document.createElement('option');
    option_selectMode.value = bulkInsertList[i];
    option_selectMode.textContent = bulkInsertList[i];
    selectMode.appendChild(option_selectMode);
  }

  addArea.appendChild(selectMode);

  // 何年の予定なのか指定する欄の追加（祝日指定の場合）
  const startYearInputLabel = document.createElement('label');
  startYearInputLabel.className = 'c-item';
  startYearInputLabel.textContent = '何年の予定か：';
  // 入力欄
  const startYearInput = document.createElement('input');
  startYearInput.type = 'number';
  startYearInput.id = 'scheduleYear';
  startYearInput.value = new Date().getFullYear();
  startYearInputLabel.appendChild(startYearInput);

  addArea.appendChild(startYearInputLabel);

  // 一括変更ボタン
  for (let i = 4; i > 0; i--) {
    const bulkBtn = document.createElement('span');
    bulkBtn.className = `btnsp btnac${i}`;
    bulkBtn.addEventListener('click', () => weekChanges(i));
    bulkBtn.textContent = bulkBtns[i.toString()];
    addArea.appendChild(bulkBtn);
  }

  // 入力済みの行は変更しない
  const cBulkFlgLabel = document.createElement('label');

  const cBulkFlg = document.createElement('input');
  cBulkFlg.type = 'checkbox';
  cBulkFlg.id = 'cbulkflg';
  cBulkFlg.addEventListener('change', function(event) {
    // console.log(`[入力済みの行は変更しない]が、「${cBulkFlgCheck}」から「${event.target.checked}」に変更されます`);
    cBulkFlgCheck = event.target.checked;
  });
  cBulkFlgLabel.appendChild(cBulkFlg);

  const cBulkFlgText = document.createTextNode('入力済みの行は変更しない');
  cBulkFlgLabel.appendChild(cBulkFlgText);

  addArea.appendChild(cBulkFlgLabel);

  // 「一括で変更する」の後に追加
  bulkarea.after(addArea);
})();

/**
 * 曜日を指定して、一括で変更する
 * @param {*} key 4-1でボタンの種類を指定する
 */
function weekChanges(key) {
  try {
    const year = document.getElementById('scheduleYear').value;
    const input_tags = document.getElementById("listtable").getElementsByTagName("tr");
    for (let i = 0; i < input_tags.length; i++) {
      const inputEle = input_tags[i].getElementsByTagName('input')[0];
  
      // 条件：input要素を持っている行、nameがjoinで始まる、行タイトルに曜日がある
      if (
        inputEle != undefined &&
        inputEle.name != undefined &&
        inputEle.name.startsWith('join') &&
        isTargetDay(input_tags[i].getElementsByTagName('td')[0].textContent, year)
      ) {
        // 伝助内で使用されているメソッド
        bulkchange(inputEle.name.slice(5), key);
      }
    }
    // console.log('変更が完了しました');
  } catch (err) {
    console.log(err);
  }
}

function bulkchange(id,key){
  if(document.getElementById("join-"+id).value>0 && cBulkFlgCheck==true){
  }else{
    for(i=1;i<=4;i++){
      if(i==key){
        document.getElementById(id+i).className = "btnsp btnac"+key;
        document.getElementById("join-"+id).value = key;
      }else{
        if(document.getElementById(id+i)!=null){
          document.getElementById(id+i).className = "btnsp btnna";
        }
      }
    }
  }
}

/**
 * 一括変更ボタン押下時の処理
 * @param {*} label 「mm/dd(D)」
 * @param {*} year 指定した年
 * @returns 日付が変更対象のものならtrue、対象でないならfalse
 */
function isTargetDay(label, year) {
  // 正規表現で月、日、曜日を抽出
  const match = label.match(/^(\d{1,2})\/(\d{1,2})\((.)\)$/);

  const month = match ? match[1] : null; // 月
  const day = match ? match[2] : null;   // 日
  const weekday = match ? match[3] : null; // 曜日
  const weekdayIndex = weekday ? daysOfWeek.indexOf(weekday) : null;

  // 指定モードが曜日
  if (daysOfWeek.includes(selectedBulkInsertModeNum)) {
    // console.log(`${weekday} == ${selectedBulkInsertModeNum} -> ${weekday == selectedBulkInsertModeNum}`);
    return weekday == selectedBulkInsertModeNum;
  }

  // 指定モードが平日か土日
  else if (["平日", "土日"].includes(selectedBulkInsertModeNum)) {
    return customBulkWeeks[selectedBulkInsertModeNum].includes(weekday);
  }

  // // 指定モードが祝日
  // else if ("祝日" == selectedBulkInsertModeNum) {
  //   let targetDay = undefined;
  //   // 日付があっているか確認する
  //   for (let i = 0; i < 5; i++) {
  //     const confirmDay = new Date(year + i, month, day);
  //     if (confirmDay.getDay() == weekdayIndex) {
  //       targetDay = confirmDay;
  //       break;
  //     }
  //   }
  //   return false;
  //   // return holiday_jp.isHoliday(targetDay);
  // }

  return false;
}
