# Command パターン

Command パターンはメソッドの呼び出し、要求、操作を単一のオブジェクトにカプセル化することを目的としたパターン。要求をオブジェクトにしてメソッドに渡す。

要求をオブジェクトにしたものを Command オブジェクトと言う。

アクションを呼び出すオブジェクトを、抽象クラス（オブジェクト）から切り離し、具象クラス(オブジェクト)を交換する際の全体的な柔軟性を高めることができる。

## 具象クラスとは

抽象クラスの欠落している機能をすべて実装した派生クラスのこと（要はサブクラス）。

抽象クラスはインタフェースを定義するクラスだが、必ずしもすべてのメンバ関数の実装を提供しているわけではなく、具象クラスは抽象クラスで実装されていないメンバ関数の実装を提供することが期待されている。

## Command パターンの考え方

コマンドパターンの一般的な考え方は、コマンドを実行しているものからコマンドを発行する責任を分離し、その責任を別のオブジェクトに委譲する手段を提供すること。

Command オブジェクトは、アクションとそのアクションを呼び出すオブジェクトの両方をバインドする。

それらは一貫して実行操作（`run()`や`execute()`など）を含む。同じインターフェイスを持つ全ての Command オブジェクトは必要に応じて簡単にスワップすることができる。

## 通常のメソッド呼び出しと Command パターンとのメソッド呼び出しの違い

言葉だけだと分かり辛いため、通常のメソッド呼び出しと Command パターンとのメソッド呼び出しの違いを見てみる。

### 通常のメソッド呼び出し

```javascript
const nameManager = {
  getFullName: (firstName, lastName) => `I am ${firstName} ${lastName}.`
};

console.log(nameManager.getFullName('John', 'Doe')); // I am John Doe.
```

`getFullName（）`を直接呼び出している。

### Command パターンとメソッド呼び出し

```javascript
const nameManager = {
  getFullName: (firstName, lastName) => `I am ${firstName} ${lastName}.`
};

nameManager.execute = (name, ...arguments) =>
  nameManager[name] && nameManager[name].apply(nameManager, arguments);

console.log(nameManager.execute('getFullName', ['John', 'Doe'])); // I am John Doe.
```

`getFullName（）`を直接呼び出すのではなく、`execute()`にオブジェクトにした要求（実行したいメソッド名と引数）を渡してメソッドを呼び出している。

そのため、オブジェクトにした要求（Command オブジェクト）は`'getFullName', ['John', 'Doe']`を指す。

## Command パターンの利用例

以下は車の購入サービスのオブジェクト。

```javascript
const carManager = {
  // 情報をリクエストする
  requestInfo: (model, id) =>
    `The information for ${model} with ID ${id} is foobar`,

  // 車を購入する
  buyVehicle: (model, id) =>
    `You have successfully purchased Item ${id} , a ${model}`,

  // 見学を予約する
  arrangeViewing: (model, id) =>
    `You have successfully booked a viewing of ${model} (${id})`
};

console.log(carManager.arrangeViewing('Ferrari', '14523'));
// You have successfully booked a viewing of Ferrari (14523)
```

上記の場合、`carManager`のメソッドに直接アクセスしてメソッド呼び出しができる。

`carManager`に Command パターンを適用する。

```javascript
const carManager = {
  // 情報をリクエストする
  requestInfo: (model, id) =>
    `The information for ${model} with ID ${id} is foobar`,

  // 車を購入する
  buyVehicle: (model, id) =>
    `You have successfully purchased Item ${id} , a ${model}`,

  // 見学を予約する
  arrangeViewing: (model, id) =>
    `You have successfully booked a viewing of ${model} (${id})`
};

// 実行操作
carManager.execute = (name, ...arguments) =>
  carManager[name] && carManager[name].apply(carManager, arguments);

console.log(carManager.execute('arrangeViewing', 'Ferrari', '14523'));
// You have successfully booked a viewing of Ferrari (14523)
```

実行操作である`execute()`を追加し、Command オブジェクト（`'arrangeViewing', 'Ferrari', '14523'`）を渡して実行する。

メソッドを直接呼び出すのではなく、`execute()`を介して呼び出すようになった。

## ゲームの入力設定

以下は、あるゲームで、ユーザの入力を処理するロジックと想定する。入力をゲーム内で何らかの意味のある動作（攻撃など）に変換する。

```js
class InputHandler {
  handleInput() {
    if (isPressed(BUTTON_X)) jump(); // ジャンプ
    if (isPressed(BUTTON_Y)) fireGun(); // 発砲
    if (isPressed(BUTTON_A)) swapWeapon(); // 武器の交換
    if (isPressed(BUTTON_B)) lurchIneffectively(); // 意味もなくふらつく
  }
}
```

上記のコードでも一応動作はする。

もし、ボタンと動作の対応（キーコンフィグ）をユーザーが設定できる場合、`jump()`や`fireGun()`の呼び出しを入れ替えができるものに変更しなくてはならない。

「入れ替え」をするためには、ゲーム内の動作を表すコマンドオブジェクトを追加する必要がある。

そのため、コマンド（オブジェクトにラップされたメソッド呼び出し）を表すクラスを定義する。

```js
class Command {
  // 具象クラスでオーバーライドする必要がある
  execute() {
    throw 'NotImplementedError';
  }
}

class JumpCommand extends Command {
  execute() {
    jump();
  }
}

class FireCommand extends Command {
  execute() {
    fire();
  }
}

class SwapWeaponCommand extends Command {
  execute() {
    swapWeapon();
  }
}

class LurchIneffectively extends Command {
  execute() {
    lurchIneffectively();
  }
}
```

各ボタンに対するコマンドオブジェクトを格納する。

```js
class InputHandler {
  constructor() {
    // 各ボタンに対するコマンドオブジェクトを格納する
    this.buttonX = new JumpCommand();
    this.buttonY = new FireCommand();
    this.buttonA = new SwapWeaponCommand();
    this.buttonB = new LurchIneffectively();
  }

  handleInput() {
    if (isPressed(BUTTON_X)) this.buttonX.execute(); // ジャンプ
    if (isPressed(BUTTON_Y)) this.buttonY.execute(); // 発砲
    if (isPressed(BUTTON_A)) this.buttonA.execute(); // 武器の交換
    if (isPressed(BUTTON_B)) this.buttonB.execute(); // 意味もなくふらつく
  }
}
```

結果として、関数の呼び出しを直接呼び出しから、コマンドオブジェクトという間接参照の層を介して呼び出すようになった。

コマンドオブジェクトは共通のインターフェース（`execute`メソッドを持っている）のため、コマンドを入れ替えるためには、コマンドオブジェクトの参照を変更すればよくなった。

## アクターへの指示

上記のコマンドクラスは使える場合はかなり限られている。

`jump()`や`fireGun()`が、暗黙のうちにプレーヤーのキャラクターを見つけて動かす方法を知っていることを前提としていることが問題。

この前提があるため、コマンドの用途が限定されてしまう。

そのため、関数を呼び出すと、その関数が自分でコマンドの対象を見つけるのではなく、関数を呼び出すときに対象としたいオブジェクトを渡すようにする（`jump()`自身が自分でコマンドの対象を見つけるのではなく、`jump()`を呼び出すときに対象としたいオブジェクトを渡すようにする）。

今回の場合`GameActor`というクラスが、ゲーム内のキャラクター表すクラスとし、各コマンドの`execute`メソッドにアクター（`actor`）を渡す。

```js
class JumpCommand extends Command {
  execute(actor) {
    actor.jump();
  }
}

class FireCommand extends Command {
  execute(actor) {
    actor.fire();
  }
}

class SwapWeaponCommand extends Command {
  execute(actor) {
    actor.swapWeapon();
  }
}

class LurchIneffectively extends Command {
  execute(actor) {
    actor.lurchIneffectively();
  }
}
```

このようにすれば、このクラスだけで、ゲーム内の任意のキャラクターを動かすことができる。

あとは、`inputHandler`とコマンドの間に、「コマンドを受け取って、そのコマンドに適切なオブジェクトに対して呼び出す処理」を追加する。

まずは、`handleInput()`がコマンドを返すように変更する。

```js
class InputHandler {
  constructor() {
    // 各ボタンに対するコマンドオブジェクトを格納する
    this.buttonX = new JumpCommand();
    this.buttonY = new FireCommand();
    this.buttonA = new SwapWeaponCommand();
    this.buttonB = new LurchIneffectively();
  }

  handleInput() {
    if (isPressed(BUTTON_X)) return this.buttonX; // ジャンプ
    if (isPressed(BUTTON_Y)) return this.buttonY; // 発砲
    if (isPressed(BUTTON_A)) return this.buttonA; // 武器の交換
    if (isPressed(BUTTON_B)) return this.buttonB; // 意味もなくふらつく

    return null;
  }
}
```

このメソッド内では渡すべきアクターが不明なため、コマンドは実行できない。

そのため、以下のようにコマンドを受け取って、アクターに対してそれを実行することが必要になる。

```js
const command = inputHandler.handleInput();

if (command) command.execute(actor);
```

これで、最初の例である「ゲームの入力設定」と同じ動作をするようになった。

コマンドとそれを実行するアクターの間に間接参照の層追加した(`handleInput`内で`execute`を呼び出さないようにした)ことにより、ちょっとしたことが可能になった。

つまり、コマンドを適用する対象のアクターを切り替えることによって、ゲーム内の任意のアクターをプレーヤーがコントロールできるようになった。

## 取り消しと再実行

```js
// `() => unit.moveTo(x, y)`がコマンドオブジェクト
const makeMoveUnitCommand = (unit, x, y) => () => unit.moveTo(x, y);
const moveCommand = makeMoveUnitCommand(doraemonm, 40, 20);
moveCommand();
```

```js
const makeMoveUnitCommand = (unit, x, y) => {
  let xBefore, yBefore;
  return {
    execute: () => {
      xBefore = unit.x();
      yBefore = unit.y();
      unit.moveTo(x, y);
    },
    undo: () => {
      unit.moveTo(xBefore, yBefore);
    }
  };
};
```
