const obj = {
  run: function (param) { console.log(param) }
}

function k(method) {
  method()
};

k(obj.run)