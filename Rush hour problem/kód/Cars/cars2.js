let cars = []

function Car(color, length, row, column, horizontal){
    this.color = color;
    this.length = length;
    this.row = row;
    this.column = column;
    this.horizontal = horizontal;
}

let redCar = new Car('red', 2, 3, 2, true);
let blueCar = new Car('blue', 3, 6, 4, true);
let greenCar = new Car('green', 3, 1, 4, false);
let greyCar = new Car('grey', 2, 5, 3, true);
let purpleCar = new Car('purple', 3, 2, 5, false);
let pinkCar = new Car('pink', 2, 5, 1, false);
let orangeCar = new Car('orange', 2, 1, 2, true);
let yellowCar = new Car('yellow', 3, 2, 1, false);

cars.push(redCar, blueCar, greenCar, greyCar, purpleCar, pinkCar, orangeCar, yellowCar);

module.exports.cars = cars;
module.exports.Car = Car;