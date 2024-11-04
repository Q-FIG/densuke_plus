/**
 * イベント画面
 * ・入力済み予定のコピペ
 * ・平日・祝日のみに予定を入力
 */

// 祝日を取得する
import { isHoliday } from "@holiday-jp/holiday_jp";

// 定数
const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
const bulkInsertList = [...daysOfWeek, "平日", "土日", "祝日"];
const customBulkWeeks = {
  "平日": ["月", "火", "水", "木", "金"],
  "土日": ["土", "日"]
};
const noneYearinput = 'none-yearinput'; // 非表示にするクラス名
const btnChoices = {
  2: {
    3: '○',
    1: '×',
  },
  3: {
    3: '○',
    2: '△',
    1: '×',
  },
  4: {
    4: '◎',
    3: '○',
    2: '△',
    1: '×',
  }
};

// 変数
let selectedBulkInsertModeNum = "";
let cBulkFlgCheck = false;
let btnNum = 3;

(() => {
  // 追加エリア 「一括で変更する」の後に追加
  const bulkarea = document.getElementById('bulkarea');
  btnNum = bulkarea.querySelectorAll('span.btnsp').length;

  // 以下、追加分
  const addArea =  document.createElement('details');
  addArea.className = 'd-plus-area';
  bulkarea.after(addArea);

  // 追加分タイトル
  const summary = document.createElement('summary');
  summary.textContent = '【拡張分】曜日・祝日指定を、一括で変更する';
  addArea.appendChild(summary);

  // 選択肢
  const selectMode = document.createElement('select');
  selectMode.className = 'c-item';
  selectMode.addEventListener('change', function(event) {
    // console.log(`選択したモードが、「${selectedBulkInsertModeNum}」から「${event.target.value}」に変更されます`);
    selectedBulkInsertModeNum = event.target.value;

    // 祝日を選択したなら、年入力欄を表示、その他なら非表示
    const yearInput = document.querySelector('label#scheduleYearArea');
    if (event.target.value == "祝日" && yearInput.classList.contains(noneYearinput)) {
      yearInput.classList.remove(noneYearinput);
    } else if (event.target.value != "祝日" && !yearInput.classList.contains(noneYearinput)) {
      yearInput.classList.add(noneYearinput);
    }
  });
  addArea.appendChild(selectMode);
  
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

  // 何年の予定なのか指定する欄の追加（祝日指定の場合）
  const startYearInputLabel = document.createElement('label');
  startYearInputLabel.id = 'scheduleYearArea';
  startYearInputLabel.className = 'c-item none-yearinput';
  startYearInputLabel.textContent = '何年の予定か：';
  addArea.appendChild(startYearInputLabel);

  // 入力欄
  const startYearInput = document.createElement('input');
  startYearInput.type = 'number';
  startYearInput.id = 'scheduleYear';
  startYearInput.value = new Date().getFullYear();
  startYearInputLabel.appendChild(startYearInput);

  // 一括変更ボタン
  Object.entries(btnChoices[btnNum]).forEach(([key, val]) => {
    const bulkBtn = document.createElement('span');
    bulkBtn.className = `btnsp btnac${key}`;
    bulkBtn.addEventListener('click', () => weekChanges(key));
    bulkBtn.textContent = val;
    addArea.appendChild(bulkBtn);
  });

  // 入力済みの行は変更しない
  const cBulkFlgLabel = document.createElement('label');
  addArea.appendChild(cBulkFlgLabel);

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

  // -------------------------------------------
  // 入力した情報をコピペするボタンの追加
  const copyBtnsArea = document.createElement('dl');
  copyBtnsArea.className = 'd-plus-area';
  addArea.after(copyBtnsArea);

  const copyBtns = document.createElement('dd');
  copyBtnsArea.appendChild(copyBtns);

  const copyBtn = document.createElement('input');
  copyBtn.type = 'button';
  copyBtn.value = 'コピーする';
  copyBtn.className = 'c-item';
  copyBtn.addEventListener('click', () => copyInputData());
  copyBtns.appendChild(copyBtn);

  const pasteBtn = document.createElement('input');
  pasteBtn.type = 'button';
  pasteBtn.value = 'ペーストする';
  pasteBtn.className = 'c-item';
  pasteBtn.addEventListener('click', () => pasteInputData());
  copyBtns.appendChild(pasteBtn);

  const convertInputBtnsArea = document.createElement('dd');
  copyBtnsArea.appendChild(convertInputBtnsArea);

  const convertInputBtnDetails = document.createElement('details');
  convertInputBtnDetails.className = 'c-item';
  convertInputBtnsArea.appendChild(convertInputBtnDetails);

  const convertInputSummary = document.createElement('summary');
  convertInputSummary.textContent = 'ペーストする値のボタン対応';
  convertInputBtnDetails.appendChild(convertInputSummary);

  const convertInputBtnL = document.createElement('dl');
  convertInputBtnDetails.appendChild(convertInputBtnL);

  // ボタンの種類分繰り返す
  Object.entries(btnChoices[4]).forEach(([key, val]) => {
    const convertBtnSet = document.createElement('dd');
    convertInputBtnL.appendChild(convertBtnSet);

    const convertBtnB = document.createElement('span');
    convertBtnB.className = `btnsp btnac${key}`;
    convertBtnB.textContent = val;
    convertBtnSet.appendChild(convertBtnB);

    const convert2 = document.createTextNode(' → ');
    convertBtnSet.appendChild(convert2);

    // 変換先のボタンの種類を追加する
    Object.entries(btnChoices[btnNum]).forEach(([key2, val2]) => {
      const convertBtnAItemLabel = document.createElement('label');
      convertBtnSet.appendChild(convertBtnAItemLabel);

      // ラジオボタンの表示用の要素
      const convertBtnAItem = document.createElement('span');
      convertBtnAItem.className = `radio-view btnsp ${key === key2 ? `btnac${key2}` : 'btnna'}`;
      convertBtnAItem.textContent = val2;
      convertBtnAItemLabel.appendChild(convertBtnAItem);

      // 実際のラジオボタン
      const convertBtnAItemInput = document.createElement('input');
      convertBtnAItemInput.type = 'radio';
      convertBtnAItemInput.name = `convert${key}`;
      convertBtnAItemInput.value = key2;
      convertBtnAItemInput.className = `radio-btn`;
      convertBtnAItemInput.checked = key === key2;
      convertBtnAItemLabel.appendChild(convertBtnAItemInput);

      // ラジオボタンの状態に応じてクラスを切り替え
      convertBtnAItemInput.addEventListener('change', () => {
        if (convertBtnAItemInput.checked) {
          // すべてのボタンからアクティブクラスを削除
          const allButtons = convertBtnSet.querySelectorAll('.radio-view');
          allButtons.forEach(btn => btn.classList.replace(`btnac${
            Object.entries(btnChoices[btnNum]).find(([k, v]) => v === btn.textContent)?.[0]
          }`, 'btnna'));
          
          // 選択したボタンにアクティブクラスを追加
          convertBtnAItem.classList.replace('btnna', `btnac${key2}`);
        }
      });
    });
  });
})();

/**
 * 曜日を指定して、一括で変更する
 * @param {*} key 4-1でボタンの種類を指定する
 */
function weekChanges(key) {
  try {
    const year = document.getElementById('scheduleYear').value;
    const input_tags = document.getElementById("listtable").getElementsByTagName("tr");
    // 入力行分繰り返す
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
    for(let i=1;i<=4;i++){
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

  const month = match ? match[1] - 1 : null; // 月
  const day = match ? match[2] : null;   // 日
  const weekday = match ? match[3] : null; // 曜日
  const weekdayIndex = weekday ? daysOfWeek.indexOf(weekday) : null;

  // 指定モードが曜日
  if (daysOfWeek.includes(selectedBulkInsertModeNum)) {
    return weekday == selectedBulkInsertModeNum;
  }

  // 指定モードが平日か土日
  else if (["平日", "土日"].includes(selectedBulkInsertModeNum)) {
    return customBulkWeeks[selectedBulkInsertModeNum].includes(weekday);
  }

  // 指定モードが祝日
  else if ("祝日" == selectedBulkInsertModeNum) {
    // 日付があっているか確認する
    for (let i = 0; i < 5; i++) {
      const confirmDay = new Date(Number(year) + i, month, day);
      if (confirmDay.getDay() == weekdayIndex) {
        return isHoliday(confirmDay);
      }
    }
    for (let i = 1; i < 4; i++) {
      const confirmDay = new Date(Number(year) - i, month, day);
      if (confirmDay.getDay() == weekdayIndex) {
        return isHoliday(confirmDay);
      }
    }
  }

  return false;
}

function copyInputData() {
  const input_tags = document.getElementById("listtable").getElementsByTagName("tr");
  let dataList = {};

  for (let i = 0; i < input_tags.length; i++) {
    const inputEle = input_tags[i].getElementsByTagName('input')[0];

    // 条件：input要素を持っている行、nameがjoinで始まる、行タイトルに曜日がある
    if (
      inputEle != undefined &&
      inputEle.name != undefined &&
      inputEle.name.startsWith('join')
    ) {
      dataList[input_tags[i].getElementsByTagName('td')[0].textContent] = inputEle.value;
    }
  }

  // JSON形式でデータをクリップボードに保存する
  navigator.clipboard.writeText(JSON.stringify(dataList));

  window.alert('コピーしました');
}

function pasteInputData() {
  navigator.clipboard.readText()
  .then(savedData => {
    if (savedData) {
      const dataList = JSON.parse(savedData);

      // {出力ボタン番号: 入力ボタン番号}
      let dataMap = {};
      Object.keys(btnChoices[4]).forEach(key => {
        const selector = document.querySelector(`input[name="convert${key}"]:checked`);
        dataMap[key] = selector ? selector.value : null;
      });
  
      // 入力フィールドにデータを設定
      const input_tags = document.getElementById("listtable").getElementsByTagName("tr");
      for (let i = 0; i < input_tags.length; i++) {
        const inputEle = input_tags[i].getElementsByTagName('input')[0];
        const data = dataMap[dataList[input_tags[i].getElementsByTagName('td')[0].textContent]];
  
        // 条件：input要素を持っている行、nameがjoinで始まる、dataが存在する
        if (
          inputEle != undefined &&
          inputEle.name != undefined &&
          inputEle.name.startsWith('join') &&
          data
        ) {
  
          const id = inputEle.name.slice(5);
          // 切り替え
          for(let i=1;i<=4;i++){
            if(i==data){
              document.getElementById(id+i).className = "btnsp btnac"+data;
              document.getElementById("join-"+id).value = data;
            }else{
              if(document.getElementById(id+i)!=null){
                document.getElementById(id+i).className = "btnsp btnna";
              }
            }
          }
        }
      }
    }
  })
  .catch(err => {
    console.error('ユーザが拒否、もしくはなんらかの理由で失敗', err);
  });
}
