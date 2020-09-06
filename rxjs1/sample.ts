import { Observable, Observer, timer, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

////////////
// 共通関数
function runOperator(uocFunc: Function, errorFlow: Function | null): (obsv: Observable<any>) => Observable<any> {
  return (obsv: Observable<any>) =>
  Observable.create((obse: Observer<any>) => {
    obsv.subscribe({
      next(value) {
        try {
          let ret = uocFunc(value);
          if (ret instanceof Observable) {
            // 非同期処理の場合
            ret.subscribe({
              next(value) { obse.next(value) },
              error(err) {
                // 処理が失敗した場合
                obse.complete(); // 実行中のフローを中断
                // エラー処理フローが定義されていれば、実行中のフローを中断して新たなフローを開始
                if (errorFlow) {
                  errorFlow(err);
                } else {
                // エラー処理が定義されていなければ、エラー情報を出力
                console.log('ノード処理でエラー発生');
                console.log(err);
                }
              }
            });
          } else {
            // 同期処理(成功)の場合
            obse.next(ret);
          }
        } catch (err) {
          // 同期処理(失敗)の場合
          // 処理内容は非同期の場合と同様
          obse.complete();
          if (errorFlow) {
            errorFlow(err);
          } else {
            console.log('ノード処理でエラー発生');
            console.log(err);
          }
        }
      }
      // error(err) {observer.error(err);},
      // complete() {observer.complete();}
     });
  });
}

//////////////////////////
// ロジック/メソッド/UOC 

function uoc1(n: number) {
  console.log('uoc1: ' + n);
  return n * 2;
}
function uoc2(n: number) {
  console.log('uoc2: ' + n);
  throw new Error('error!');
}

/** 非同期処理の例 */
function uoc3(n: any) {
  console.log('uoc3: ' + n);
  return timer(1000).pipe(mapTo(n));
}
function uoc4(n: any) {
  console.log('uoc4: ' + n);
}

///////////
// Facade
function myFlow1(n: any) {
  of(n)
  .pipe(
    runOperator(uoc1, null),
    runOperator(uoc2, mySubFlow1), // 例外発生(エラー処理のフローあり)
    // runOperator(uoc2, null), // 例外発生(エラー処理のフローなし: 不正ケース)
    )
  .subscribe();
}

function mySubFlow1(n: any) {
  of(n)
  .pipe(
    runOperator(uoc3, null), // 非同期処理
    runOperator(uoc4, null)
  )
  .subscribe();
}

myFlow1(1);
