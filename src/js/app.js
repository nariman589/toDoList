const button = document.querySelector(".btn"); //Сохраняю кнопку
const input = document.querySelector(".myInput"); //Сохраняю интуп
const list = document.querySelector(".list"); //Сохраняю тоду лист (ul class=list)

addEventListener("click", (e) => {
  //Отслеживаю клик по всей странице
  if (e.target !== button) {
    //блокирую кнопку
    button.disabled = "true";
    button.style.backgroundColor = "Green";
    button.style.opacity = "0.4";
  }

  input.addEventListener("keypress", (inputtedInfo) => {
    //отслеживаю ввод в инпут
    if (inputtedInfo.key !== "Enter") {
      //Это сделано для того , чтобы разблокировать кнопку "Добавить"
      button.disabled = false;
      button.style.backgroundColor = "#F44336";
      button.style.opacity = "1";
    }
    if (inputtedInfo.key === "Enter" && input.value !== "") {
      //Тут проверяю не пустой ли инпут
      let newTodo = {
        content: input.value,
        date: new Date(),
      };
      createToDoList(newTodo); //тут отправляю объект с данными , для отрисовки в хтмл
      input.value = ""; //обнуляю значение инпута
      button.style.backgroundColor = "Green"; //снова деактивирую кнопку(визуально)
      button.style.opacity = "0.4";
    }
    checkEmptyOrNot(); //эта проверка на отображение строки "Пока пусто" сверху
  });

  if (e.target === button) {
    // тут ловлю клик по кнопке "Добавить"
    if (input.value !== "") {
      button.disabled = false; //разблокирую кнопку
      let newTodo = {
        content: input.value,
        date: new Date(),
      };
      createToDoList(newTodo); //Так же отправляю данные на отрисовку в хтмл но уже с кнопки "Добавить"
      input.value = ""; //Обнуляю значение инпута(опустошаю)
      button.style.backgroundColor = "Green"; //снова визуально блокирую кнопку
      button.style.opacity = "0.4";
    }
    checkEmptyOrNot(); //эта проверка на отображение строки "Пока пусто" сверху
  }

  function createToDoList(objWithInfo) {
    //Функция для визуализации данных в хтмлке
    const date = objWithInfo.date;
    const li = document.createElement("li"); //создаю элемент с тегом ли
    const monthes = [
      //это массив с месяцами , он нужен чтобы вернуть месяц в виду строки (js возвращает месяц только в виде цифры)
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    li.innerHTML = `<button id=${
      list.childElementCount
    } class="checkbox"></button> <input type="text" class="toDoListText" disabled value="${
      objWithInfo.content
    } ${date.getDate()} ${
      monthes[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${correctMinutes(
      date.getMinutes()
    )}" ><button class="remove" id=${
      list.childElementCount
    } ></button> <button class="editter" id=${
      list.childElementCount
    }></button>`; //добавляю ООООЧЕНЬ много элементов тут и кнопка чек бокса и строка со значением из инпута , кнопка удаления , кнопка редактирования и дата
    document.querySelector(".list").appendChild(li); //Добавляю li элемент в ul class="list"
    setTimeout(() => alert(`🛎 Не забудь про: ${objWithInfo.content}`), 10000); //Это напоминалка о деле
  }
  function correctMinutes(minute) {
    //js и минуты выдает неправильно , поэтому тут я привожу её в нужный вид
    minute = minute.toString();
    if (minute.length < 2) {
      return "0" + minute;
    }
    return minute;
  }
  if (e.target.className === "remove") {
    //это логика для кнопки удаления
    e.target.parentElement.remove(); //мол нажал на кнопку то пусть всё удалится
    //проверка на пустоту списка , может быть такое ,что последний элемент списка взаимодействует именно с этой кнопкой поэтому стараемся выполнять проверку сразу
    checkEmptyOrNot();
  }
  if (e.target.className === "editter") {
    //тут логика для кнопки изменения
    const inputListElem = e.target.parentElement.children[1]; //тут вытаскиваю именно элемент в котором содержится мой текст
    const sibilians = inputListElem.parentElement.children; //это я сделал , чтобы визуально убрать остальные кнопки во время редактирования
    sibilians[0].style.display = "none"; //кнопка чекбокс не видна
    sibilians[2].style.display = "none"; //кнопка едит не видна
    sibilians[3].style.display = "none"; //кнопка ремув тоже не видна
    inputListElem.className = "toDoListTextChanging"; //меняю класс так как интерфейс после нажатия кнопки меняется
    inputListElem.removeAttribute("disabled"); //Включаю редактирование текста
    const saveButton = document.createElement("button"); //тут создаю новую кнопку которая будет взаимодействовать с текстом
    saveButton.innerHTML = "Сохранить";
    saveButton.className = "saveButton"; //задаю кнопке класс
    inputListElem.parentElement.appendChild(saveButton); //добавляю кнопку
  }
  if (e.target.className === "saveButton") {
    //тут логика для кнопки сохранения
    const inputListElem = document.querySelector(".toDoListTextChanging"); //беру свой элемент с измененным классом
    inputListElem.className = "toDoListText"; //возвращаю ему старый класс
    const sibilians = inputListElem.parentElement.children; //тут я хочу вернуть остальные кнопки после сохранения
    sibilians[0].style.display = ""; //кнопка чекбокс видна
    sibilians[2].style.display = ""; //кнопка едит видна
    sibilians[3].style.display = ""; //кнопка ремув видна
    inputListElem.disabled = "true"; //снова выключаю редактирование текста
    e.target.remove(); //удаляю кнопку
  }
  if (e.target.className === "checkbox") {
    //тут перевожу из списка туду в список доне
    const text = e.target.parentElement.children[1].value; //тут сохраняю текст
    const li = document.createElement("li"); //тут создаю новый элемент списка
    li.innerHTML = `${text}<button class="remove"</button>`; //в новый элемент передаю старый текст и кнопку удаления
    e.target.parentElement.remove(); //удаляю элемент из списка туду
    document.querySelector(".toDoDone").appendChild(li); //добавляю в список доне
    checkEmptyOrNot();
    //проверка на пустоту списка , может быть такое ,что последний элемент списка взаимодействует именно с этой кнопкой поэтому стараемся выполнять проверку сразу
  }
  function checkEmptyOrNot() {
    if (list.childElementCount > 1) {
      //эта проверка на отображение строки "Пока пусто" сверху
      document.querySelector(".emptyList").style.display = "none";
    }
    if (list.childElementCount <= 1) {
      document.querySelector(".emptyList").style.display = "";
    }
  }
});
