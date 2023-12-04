let nombres = [4, 2, 5, 1, 3];
nombres.sort((a, b) => a - b);
console.log(nombres);

var items = [
    { name: "Edward", value: 21 },
    { name: "Sharpe", value: 37 },
    { name: "And", value: 45 },
    { name: "The", value: -12 },
    { name: "Magnetic", value: 13 },
    { name: "Zeros", value: 37 },
  ];
  items.sort(function (a, b) {
    return a.value - b.value;
  });
  console.log(items.keys);
  