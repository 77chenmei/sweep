//点击开始游戏-> 动态生成64个小格 -> 64 div
//leftClick 没有雷 -> 显示数字(代表以当前小格为中心，周围相连的8个小格的雷数) 扩散(当前8个格都没有雷)
//          有雷 -> game Over
//rightClick 没有标记且没有数字 -> 进行标记，有标记 -> 取消标记 ->标记是否正确，10个都正确标记，提示成功
//          已经出现数字 -> 无效果

var startBtn = document.getElementsByClassName('startBtn')[0],
    main = document.getElementsByClassName('main')[0],
    sweep = document.getElementsByClassName('sweep')[0],
    alertBox = document.getElementsByClassName('alertBox')[0],
    altertImg = document.getElementsByClassName('altertImg')[0],
    closeBtn = document.getElementsByClassName('closed')[0],
    sweepScore = document.getElementsByClassName('sweepNum')[0],
    chosenLevel = document.getElementsByClassName('chosenLevel')[0].getElementsByTagName('li'),
    minesNum, //雷数
    mineOver, //雷标记的数
    mineMap = [], //雷的值
    isStartGame = true;
bindEvent(); //事件绑定
function bindEvent() {
    //点击游戏开始
    startBtn.onclick = function () {
        if(isStartGame){
            main.style.display = 'block';
            init(1); //动态生成雷
            isStartGame = false;
        }   
    }
    //取消鼠标默认事件 右击
    sweep.oncontextmenu = function(){
        return false;
    }
    sweep.onmousedown = function(e){
        var event = e.target;
        if(e.which == 1){
            leftClick(event);
        }else if(e.which == 3){
            rightClick(event);
        }
    }
    closeBtn.onclick = function(){
        alertBox.style.display = 'none';
        main.style.display = 'none';
        sweep.innerHTML = ''; 
        isStartGame = true;
    }
    //点击选择 难度级别
    for(var i = 0;i < chosenLevel.length;i++){
        (function(j){
            chosenLevel[j].onclick = function(){
                sweep.innerHTML = '';
                init(j + 1)
            }
        }(i))  
    }
}

function init(level) {
    //判断此时扫雷的难度级别 1 ，2 ，3级别
    var sweepNum = 0; //总棋子数
    switch (level) {
        case 1:
            minesNum = 5;
            mineOver = 5;
            sweepNum = 64;
            break;
        case 2:
            minesNum = 10;
            mineOver = 10;
            sweepNum = 100;
            break;
        case 3:
            minesNum = 100;
            mineOver = 100;
            sweepNum = 400;
            break;
        default: break;
    }
    sweep.style.width = Math.sqrt(sweepNum) * 30 + 'PX';
    sweep.style.height = Math.sqrt(sweepNum) * 30 + 'PX';

    sweepScore.innerHTML = mineOver;

    //生成div
    for(var i = 0;i< Math.sqrt(sweepNum);i++){
        for(var j = 0;j<Math.sqrt(sweepNum);j++){
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id',i + '-' + j);
            sweep.appendChild(con);
            mineMap.push({mine:0})
        }
    }
    //随机生成雷数
    block = document.getElementsByClassName('block');
    while(minesNum){
        var mineIndex = Math.floor(Math.random() * sweepNum);
        if(mineMap[mineIndex].mine === 0){ //表示当前生成一个雷
            block[mineIndex].classList.add('isLei');
            mineMap[mineIndex].mine = 1;
            minesNum --;
        }
    }
}
//鼠标左键
function leftClick(dom){ 
    if(dom.classList.contains('num') || dom.classList.contains('flag')){
        return;
    }
    //dom 存在，且classList中右isLei这个className
    if(dom && dom.classList.contains('isLei')){
        //显示所有的雷
        var isLei = document.getElementsByClassName('isLei');
        for(var i = 0; i< isLei.length;i++){
            isLei[i].classList.add('show')
        }
        //出现弹窗
        setTimeout(function(){
            alertBox.style.display = 'block';
            altertImg.style.background = "url('./img/over.jpg')";
        },800)
    }else{
        //点击不是雷的div
        var n = 0,
            person = dom && dom.getAttribute('id').split('-'),
            perX = person && + person[0],//将字符串转化为数字
            perY = person && + person[1];
            dom && dom.classList.add('num');
        for(let i = perX - 1 ;i <= perX + 1; i++){
            for(let j = perY - 1; j <= perY + 1;j++){
                var aroundBox = document.getElementById(i + '-' + j);
                if(aroundBox && aroundBox.classList.contains('isLei')){
                    n ++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        //如果周围没有雷，进行扩散
        if(n == 0){
            for(let i = perX - 1 ; i <= perX + 1; i++){
                for(let j = perY - 1;j <= perY + 1;j++){
                    var nearBox = document.getElementById(i + '-' + j);
                    if(nearBox && nearBox.length != 0 ){
                        console.log(1)
                        if(!nearBox.classList.contains('check')){
                            nearBox.classList.add('check')
                            leftClick(nearBox)
                        }
                    }
                }
            }
        }
    }
}
//鼠标右击
function rightClick(demo){
    if(demo.classList.contains('num')){
        return;
    }
    //点击有旗，再次点击去除旗子
    demo.classList.toggle('flag');
    //判断如果旗子正好插在有雷的地方，雷数 -1
    if(demo.classList.contains('isLei') && demo.classList.contains('flag')){
        mineOver --;
    }
    //有雷的div旗子取消，雷 +1
    if(demo.classList.contains('isLei') && !demo.classList.contains('flag')){
        mineOver ++;
    }
    sweepScore.innerHTML = mineOver;
    // var lei = document.getElementsByClassName('isLei');
    // for(var i = 0;i < lei.length;i++){
    //     if(demo.getAttribute('id') === lei[i].getAttribute('id')){
    //         mineOver --;
    //         sweepNum.innerHTML = mineOver;
    //     }
    // }
    if(mineOver === 0){
        alertBox.style.display = 'block';
        altertImg.style.background = "url('./img/success.png')";
    }
}