export function addBackgroundScene() {
    for (let i = 0; i < 1000; i++) {
        addOneStarRow();
    }
}

const text1 = "★ ° . .　　　 　.　☾ °☆ 　.  * ● ¸    .　 . ●　　★　° : .　 .  •  ○ ° ★　 .  　 *　.　　　. 　 ° 　";
const text2 = ". .　  　 :.　 . • ○ ° ★　 . 　 *　.　　★ ° 　　.　 ☾ °☆ 　. * ● ¸ .　　 　　. 　 ° 　. ●　　★　°";
const text3 = "○ ° ★　 .　  *　. 　　　　　. ★ ° . .　 　.　☾ °☆ 　. * ●  ¸ .　　　★　 ° : .　 . • 　 ° 　. ●";

function addOneStarRow() {
    const node = document.createElement("SPAN");
    const textNode = document.createTextNode(getRandomText());
    node.appendChild(textNode);
    document.getElementById("sky").appendChild(node);
}

function getRandomText() {
    const x = Math.random();
    return x > 0.667 ? text1 : x > 0.333 ? text2 : text3;
}
