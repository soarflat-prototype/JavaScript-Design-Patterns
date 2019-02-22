const carManager = {
  // 情報をリクエストする
  requestInfo: (model, id) => `The information for ${model} with ID ${id} is foobar`,

  // 車を購入する
  buyVehicle: (model, id) => `You have successfully purchased Item ${id} , a ${model}`,

  // 見学を予約する
  arrangeViewing: (model, id) => `You have successfully booked a viewing of ${model} (${id})`
};

// 実行操作
carManager.execute = (name, ...arguments) =>
  carManager[name] && carManager[name].apply(carManager, arguments);

console.log(carManager.execute('arrangeViewing', 'Ferrari', '14523'));
// You have successfully booked a viewing of Ferrari (14523)
