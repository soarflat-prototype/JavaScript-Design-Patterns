// レシーバー（ビジネスロジック）
const TeslaSalesControl = {
  /**
   * Request information about the car
   * @param model - model of car
   * @param id - id of car
   **/
  requestInfo: (model, id) => `${model} with id: ${id}`,

  /**
   * Buy the car
   * @param model - model of car
   * @param id - id of car
   **/
  buyVehicle: (model, id) => `You purchased ${model} with id: ${id}`,

  /**
   * Arrange viewing for car
   * @param model - model of car
   * @param id - id of car
   **/
  arrangeViewing: (model, id) => `You have successfully booked a viewing of ${model} (${id})`,
};

/**
 * A generic execute function
 * Takes a receiver and a command
 * @param receiver -
 * @param command -
 **/
function execute(receiver, command) {
  return receiver[command.action] && receiver[command.action](...command.params)
}

// コマンド
const command = {
  action: 'requestInfo',
  params: ['Ferrari', '14523'],
};
execute(TeslaSalesControl, command);
// "Ferrari with id: 14523"

// コマンド
const command2 = {
  action: 'buyVehicle',
  params: ['TOYOTA', '2213'],
};
execute(TeslaSalesControl, command2);
// "You purchased TOYOTA with id: 2213"




