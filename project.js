const readline = require("readline");

const input = () =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (line) => {
      rl.close();
      resolve(line);
    });
  });

var rewardVacation = function () {
  //포상 휴가에 관한 함수
  var work_per_week = 0; //한주 동안 작업 횟수
  var to_do_work = Math.ceil(Math.random() * 10 + 7); // 2달간 해야하는 작업 횟수(7~15 랜덤)
  var work_time = 0; //병사가 실제로 한 작업 횟수
  var count_month = 8; // 2달동안 작업
  const work = ["취사지원", "진지공사", "간부따라가서작업", "예초", "분리수거"]; //포상 휴가 목록
  var complete = 0; //  작업 횟수(to_do_work) 만큼 완료 했는지 판별하는 변수 (완료==1, 완료x =0)

  var publicSoldier = {
    get complete() {
      // 외부에서 참조 가능
      return complete;
    },

    work: function (doWork) {
      //2달이 다 되었을 경우
      if (count_month == 0) {
        if (work_time >= to_do_work) {
          //할당된 작업 횟수만큼 했을 경우
          console.log("휴가부여");
          complete = 1;
        } else {
          console.log("휴가 못받음 ");
          complete = 0;
        }
        //2달이 지나고 변수 새롭게 초기화
        to_do_work = Math.ceil(Math.random() * 10 + 7); // 2달간 해야하는 작업 횟수(7~17 랜덤)
        work_time = 0; //총 작업 횟수
        count_month = 8; // 2달동안 작업
        return;
      }
      work_per_week = Math.ceil(Math.random() * 2); // 한 주간 작업 횟수를 2회 이하로 랜덤 결정
      // 작업 종류는 랜덤
      doWork(
        work_per_week,
        ((work) => work[Math.floor(Math.random() * work.length)])(work)
      );

      work_time += work_per_week; //작업 횟수 누적
      count_month--; //8주를 1씩 감소
      return;
    },
  };
  Object.freeze(publicSoldier);
  return publicSoldier;
};

// 군인 생성자 함수
var Soldier = function (number, name, rank, position, leave) {
  this.number = number; // 군번
  this.name = name; //이름
  this.rank = rank; //계급
  this.position = position; //병과
  this.leave = leave; // 휴가일 수
  this.reward = rewardVacation();
};

//군인을 생성하는 커링함수
var curryingSoldier = function (number) {
  return function (name) {
    return function (rank) {
      return function (position) {
        return function (leave) {
          return new Soldier(number, name, rank, position, leave);
        };
      };
    };
  };
};

//휴가를 더해주는 메소드를 군인(Soldier) 생성자의 prototype 객체에 생성하여 인스턴스가 참조 가능하게 함
Soldier.prototype.plusLeave = function (day) {
  this.leave += day;
};

const main = async () => {
  // 첫번째 병사 정보만 직접 입력하여 생성
  process.stdout.write("병사 군번: ");
  number = await input();

  process.stdout.write("병사 이름: ");
  name = await input();

  process.stdout.write("병사 계급: ");
  rank = await input();

  process.stdout.write("병사 병과: ");
  position = await input();

  process.stdout.write("병사 휴가 일 수: ");
  leave = await input();
  leave = parseInt(leave)

  var soldier1 = new Soldier(number, name, rank, position, leave);

  var soldier2 = curryingSoldier("18-24064512")("최민혁")("일병")("전산병")(12); //커링 함수를 통해 인스턴스 생성

  // soldier1의 __proto__ 속성을 이용하여 인스턴스 생성
  var soldier3 = new soldier1.constructor(
    "18-76012345",
    "김민형",
    "전문 하사",
    "소총수",
    11
  );

  /*생성자 함수의 프로퍼티인 prototype 내부에는 constructor라는 프로퍼티가 존재하고
  원래의 생성자 함수 자기자신을 참조하므로 인스턴스 생성이 가능*/
  var soldier4 = new Soldier.prototype.constructor(
    "18-12023456",
    "이상훈",
    "병장",
    "포병",
    12
  );

  start_work(soldier1);
  start_work(soldier2);
  start_work(soldier3);
  start_work(soldier4);

  start_work(soldier1);
  start_work(soldier2);
  start_work(soldier3);
  start_work(soldier4);

  var soldierList = [
    //병사 이름과 휴가일 수를 담은 리스트
    { name: soldier1.name, leave: soldier1.leave },
    { name: soldier2.name, leave: soldier2.leave },
    { name: soldier3.name, leave: soldier3.leave },
    { name: soldier4.name, leave: soldier4.leave },
  ];

  console.log("공문: 휴가일 수 15일 이상인 병사들 출타 내보낼것\n\n");

  console.log(
    "휴가 일수가 15일 이상: " + soldierList.filter((v) => v.leave >= 15)
  );
};

//작업 종류를 정해주는 함수, callback으로 넘겨줄 함수
var set_work = function (week, work) {
  console.log(work + ":" + week + "회");
};

//작업을 시작하는 함수
var start_work = function (soldier) {
  console.log("************************");
  //2달동안 작업
  console.log(soldier.name);
  for (var i = 0; i < 9; i++) {
    soldier.reward.work(set_work);
  }

  //작업 할당량을 완료(==1)했다면(출력)
  if (soldier.reward.complete == 1) {
    console.log("기존 휴가 일수: ", soldier.leave);
    soldier.plusLeave(2);
    console.log("변경된 휴가 일수: ", soldier.leave);
  }
  console.log("************************\n");
};

Array.prototype.filter = function (callback, thisArg) {
  var result = [];
  for (var i = 0; i < this.length; i++)
    if (callback.call(thisArg || global, this[i], this))
      result.push(this[i].name);
  return result;
};

main();
