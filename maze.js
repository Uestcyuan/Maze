function getId(id) {
  return document.getElementById(id);
}
const row_column = getId("row_column");
const connect = getId("connect");
const btnConnect = getId("btnConnect");
const example = getId("example");
let strConnect = "";
const showConnect = getId("showConnect");
const prompt = document.querySelectorAll(".prompt");

let array = new Array(); // 先声明一维
let rcOk = false; // 初始规格，内容校验错误
let connectOk = false;

row_column.onfocus = () => (prompt[0].innerText = "");
connect.onfocus = () => (prompt[1].innerText = "");
example.onclick = () => {
  prompt[0].innerText = "";
  prompt[1].innerText = "";
  row_column.value = "3 3";
  connect.value =
    "0,1 0,2;0,0 1,0;0,1 1,1;0,2 1,2;1,0 1,1;1,1 1,2;1,1 2,1;1,2 2,2;2,0 2,1";
};
btnConnect.addEventListener("click", printConnect, false);

function rcTest() {
  rcOk = false;
  let rcValue = row_column.value;
  if (rcValue != "") {
    let rcValueArr = rcValue.split(" ");
    if (rcValueArr.length === 2) {
      if (
        isNaN(parseFloat(rcValueArr[0])) ||
        isNaN(parseFloat(rcValueArr[1]))
      ) {
        // 有不能转数字的
        prompt[0].innerText = "Invalid number format​.";
      } else {
        // 都能转数字
        if (
          // 都是正整数
          Number.isInteger(parseFloat(rcValueArr[0])) &&
          parseFloat(rcValueArr[0]) > 0 &&
          Number.isInteger(parseFloat(rcValueArr[1])) &&
          parseFloat(rcValueArr[1]) > 0
        ) {
          rcOk = true;
        } else {
          prompt[0].innerText = "Number out of range​.​";
        }
      }
    } else {
      prompt[0].innerText = "Incorrect command format​.​";
    }
  } else {
    prompt[0].innerText = "Incorrect command format​."; // 空着也算为格式错误
  }
}

function printWall() {
  array = [];
  if (rcOk) {
    let rowValue = row_column.value.split(" ")[0];
    let columnValue = row_column.value.split(" ")[1];
    for (let i = 0; i < rowValue * 2 + 1; i++) {
      array[i] = new Array(); //声明二维，每一个一维数组里面的一个元素都是一个数组；
      for (let j = 0; j < columnValue * 2 + 1; j++) {
        if (j === columnValue * 2) {
          array[i][j] = "[W]" + "<br>";
        } else if (j % 2 === 1 && i % 2 === 1) {
          array[i][j] = "<span>[R]</span>" + " ";
        } else {
          array[i][j] = "[W]" + " ";
        }
      }
    }
  }
}

function printConnect() {
  prompt[0].innerText = "";
  prompt[1].innerText = "";
  connectOk = false;
  strConnect = "";
  rcTest();
  printWall();
  if (rcOk) {
    let rowValue = row_column.value.split(" ")[0];
    let columnValue = row_column.value.split(" ")[1];
    let connectArray = connect.value.split(";");
    for (let i = 0; i < connectArray.length; i++) {
      try {
        let connectFirNodeI = connectArray[i].split(" ")[0].split(",")[0];
        let connectFirNodeJ = connectArray[i].split(" ")[0].split(",")[1];
        let connectSecNodeI = connectArray[i].split(" ")[1].split(",")[0];
        let connectSecNodeJ = connectArray[i].split(" ")[1].split(",")[1];
        if (
          //起码路坐标是存在的
          connectFirNodeI >= 0 &&
          connectFirNodeI <= rowValue - 1 &&
          connectFirNodeJ >= 0 &&
          connectFirNodeJ <= columnValue - 1 &&
          connectSecNodeI >= 0 &&
          connectSecNodeI <= rowValue - 1 &&
          connectSecNodeJ >= 0 &&
          connectSecNodeJ <= columnValue - 1 &&
          connectArray[i].split(" ").length === 2
        ) {
          if (connectFirNodeI === connectSecNodeI) {
            // console.log("两点同一行");
            // console.log(connectFirNodeJ - connectSecNodeJ);
            if (Math.abs(connectFirNodeJ - connectSecNodeJ) === 1) {
              // console.log("可连通");
              connectOk = true;
              let connectJ =
                connectFirNodeJ < connectSecNodeJ
                  ? connectFirNodeJ
                  : connectSecNodeJ;
              array[2 * connectFirNodeI + 1][2 * connectJ + 2] =
                "<span>[R]</span>";
            } else {
              strConnect = "";
              connectOk = false;
              // console.log("无法连通");
              prompt[1].innerText = "Maze format error.";
              break;
            }
          } else if (connectFirNodeJ === connectSecNodeJ) {
            // console.log("两点同一列");
            // console.log(connectFirNodeI - connectSecNodeI);
            if (Math.abs(connectFirNodeI - connectSecNodeI) === 1) {
              // console.log("可连通");
              connectOk = true;
              let connectI =
                connectFirNodeI < connectSecNodeI
                  ? connectFirNodeI
                  : connectSecNodeI;
              array[2 * connectI + 2][2 * connectFirNodeJ + 1] =
                "<span>[R]</span>";
            } else {
              strConnect = "";
              connectOk = false;
              // console.log("无法连通");
              prompt[1].innerText = "Maze format error.";
              break;
            }
          } else {
            strConnect = "";
            connectOk = false;
            // console.log("不同行，不同列，无法连通");
            prompt[1].innerText = "Maze format error.";
            break;
          }
        }
        // 坐标不存在
        else {
          strConnect = "";
          connectOk = false;
          // console.log("坐标不存在,可能是超出范围，可能是格式不对");
          if (
            connectFirNodeI < 0 ||
            connectFirNodeI > rowValue - 1 ||
            connectFirNodeJ < 0 ||
            connectFirNodeJ > columnValue - 1 ||
            connectSecNodeI < 0 ||
            connectSecNodeI > rowValue - 1 ||
            connectSecNodeJ < 0 ||
            connectSecNodeJ > columnValue - 1
          ) {
            prompt[1].innerText = "Number out of range​.";
            break;
          } else {
            prompt[1].innerText = "Incorrect command format​.​";
            break;
          }
        }
      } catch (error) {
        connectOk = false;
        prompt[1].innerText = "Incorrect command format​.";
        break;
      }
    }
    if (connectOk) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
          strConnect += array[i][j] + " ";
        }
      }
      showConnect.innerHTML = strConnect;
    } else {
      showConnect.innerHTML = "";
    }
  } else {
    showConnect.innerHTML = "";
  }
}
