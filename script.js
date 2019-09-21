"use strict";
let bloodRegister = {};
let cleanStudents = [];
let currentStudents = [];
let expelledStudents = [];
let sort = "none";
let house = "All";

document.addEventListener("DOMContentLoaded", start);

//   GET JSON
function start() {
  async function getJson() {
    await getBlood();
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    cleanData(await jsonData.json());
  }

  async function getBlood() {
    let bloodData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/families.json"
    );

    bloodRegister = await bloodData.json();
  }
  getJson();

  document.querySelector("#chosen_house").addEventListener("click", dropDown);

  document.querySelectorAll("#sort-by").forEach(option => {
    option.addEventListener("change", changeSort);
  });
  document.querySelectorAll("#filter_expelled").forEach(option => {
    option.addEventListener("change", changeExpelled);
  });
}

// CLEAN DATA

function cleanData(allStudents) {
  allStudents.forEach(jsonObject => {
    const student = Object.create(studentData);

    // NAMES

    const names = jsonObject.fullname.trim().split(" ");

    student.firstName =
      names[0].substring(0, 1).toUpperCase() + names[0].slice(1).toLowerCase();

    if (names.length == 2)
      student.lastName =
        names[1].substring(0, 1).toUpperCase() +
        names[1].slice(1).toLowerCase();
    else if (names.length == 3) {
      if (names[1].startsWith('"')) {
        student.nickName =
          names[1].substring(0, 2).toUpperCase() +
          names[1].slice(2).toLowerCase();

        student.lastName =
          names[2].substring(0, 1).toUpperCase() +
          names[2].slice(1).toLowerCase();
      } else {
        student.middleName =
          names[1].substring(0, 1).toUpperCase() +
          names[1].slice(1).toLowerCase();
        student.lastName =
          names[2].substring(0, 1).toUpperCase() +
          names[2].slice(1).toLowerCase();
      }
    } else student.lastName = "";

    // HOUSES

    student.house =
      jsonObject.house
        .trim()
        .substring(0, 1)
        .toUpperCase() +
      jsonObject.house
        .trim()
        .slice(1)
        .toLowerCase();

    // PHOTOS

    if (student.firstName === "Justin") {
      let lastName = names[1].substring(6, names[1].length);

      student.pictureName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;
    } else if (names.length === 1) {
      student.pictureName = `images/unknown.png`;
    } else if (student.firstName === "Padma") {
      let lastName = names[1].toLowerCase();

      student.pictureName = `images/${lastName}_${names[0]
        .substring(0, 4)
        .toLowerCase()}e.png`;
    } else if (student.firstName === "Parvati") {
      let lastName = names[1].toLowerCase();

      student.pictureName = `images/${lastName}_${names[0].toLowerCase()}.png`;
    } else if (names.length == 2) {
      let lastName = names[1].toLowerCase();

      student.pictureName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;
    } else if (names.length == 3) {
      let lastName = names[2].toLowerCase();

      student.pictureName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;
    }

    // BLOOD

    if (bloodRegister.half.includes(student.lastName))
      student.bloodStatus = "Halfblood";
    else if (bloodRegister.pure.includes(student.lastName))
      student.bloodStatus = "Pureblood";
    else student.bloodStatus = "Muggleborn";

    cleanStudents.push(student);
  });

  insertMe();

  currentStudents = cleanStudents.slice(0);

  showStudents(currentStudents);
}

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: "",
  prefect: false,
  bloodStatus: "",
  inqSquad: false
};

//   SHOW STUDENT LIST
function showStudents(students) {
  students = filterByHouse(students);

  sortBy(students);
  let dest = document.querySelector("#list");

  dest.innerHTML = "";

  students.forEach(student => {
    newBlood(student);
    let template = `
        <div class="student" style="background-image: url(images/${student.house}_wallpaper.jpg)">
        <img src=${student.pictureName}>
            <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
            <p>${student.house}</p>
        </div>`;

    dest.insertAdjacentHTML("beforeend", template);
    dest.lastElementChild.addEventListener("click", () => openPopup(student));
  });

  showAmount();

  showHouseAmount(cleanStudents);
}

// POPUP

function openPopup(student) {
  document.querySelector("#popup").style.display = "block";
  document.querySelector("#close").style.display = "block";

  document
    .querySelector("#close")
    .addEventListener("click", () => closePopup());

  showPopupInfo(student);
}

function closePopup() {
  document.querySelector("#popup").style.display = "none";
  document.querySelector("#close").style.display = "none";
}

function showPopupInfo(student) {
  let isExpelled = expelledStudents.includes(student);

  document.querySelector(".popup_content").innerHTML = `
                            <div class="student">
                            <div id="crest"><img src="images/${
                              student.house
                            }_crest.png"></div>
                            <img src=${student.pictureName}>
                            <div id="top">
                <h2>${student.firstName} ${student.middleName} ${
    student.lastName
  } ${student.nickName}</h2>
                <p>${student.house}</p>
                <p>Prefect: ${student.prefect ? "YES" : "NO"}</p>
                <p>Blood-status: ${student.bloodStatus}</p>
                <p>Inquisitorial squad: ${
                  student.inqSquad ? "YES" : "NO"
                }</p></div>
                <button class="prefect">${
                  student.prefect ? "Remove as prefect" : "Make prefect"
                }</button>
                <button class="inq">${
                  isEligibleSquad(student)
                    ? student.inqSquad
                      ? "Remove from Inquisitorial sqaud"
                      : "Add to Inquisitorial squad"
                    : "Inquisitorial squad not available"
                }</button>
                <button class="expel">${
                  isExpelled ? "EXPELLED" : "Expel student"
                }</button></div>      
                                </div>`;
  document.querySelector(
    "#popup"
  ).style.backgroundImage = `url(images/${student.house}_wallpaper.jpg)`;

  if (!isExpelled)
    document
      .querySelector(".expel")
      .addEventListener("click", () => expelStudent(student));

  document.querySelector(".prefect").addEventListener("click", () => {
    if (!student.prefect) makePrefect(student);
    else removePrefect(student);
  });

  document.querySelector(".inq").addEventListener("click", () => {
    if (!student.inqSquad) addToInq(student);
    else removeFromInq(student);
  });
}

// SORTING (HAT)

function changeSort() {
  sort = this.value;

  showStudents(currentStudents);
}

function sortBy(students) {
  if (sort == "Firstname")
    students.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
  else if (sort == "Lastname")
    students.sort((a, b) => {
      return a.lastName.localeCompare(b.lastName);
    });
  else if (sort == "House")
    students.sort((a, b) => {
      return a.house.localeCompare(b.house);
    });
}

//   FILTER

function dropDown() {
  document.querySelector(".house_content").classList.toggle("show");

  document.querySelectorAll(".house").forEach(house => {
    house.addEventListener("click", changeFilter);
  });
}

function changeFilter() {
  house = this.getAttribute("value");

  showStudents(currentStudents);

  document.querySelector(".house_content").classList.toggle("show");
  document.querySelector(
    "#chosen_house"
  ).innerHTML = `<img src="images/${house}_crest.png"><i class="fa fa-angle-down">`;
}

function filterByHouse(students) {
  return students.filter(student => {
    if (student.house === house) return true;
    else if (house === "All") return true;
    else return false;
  });
}

// SHOW DETAILS

function showAmount() {
  document.querySelector(
    "#total"
  ).innerHTML = `Total number of students: ${cleanStudents.length}`;

  document.querySelector(
    "#total_expelled"
  ).innerHTML = `Total number of expelled students: ${expelledStudents.length}`;
}

function showHouseAmount(cleanStudents) {
  let gryffindor = cleanStudents.filter(obj =>
    obj.house.includes("Gryffindor")
  );
  let hufflepuff = cleanStudents.filter(obj =>
    obj.house.includes("Hufflepuff")
  );
  let slytherin = cleanStudents.filter(obj => obj.house.includes("Slytherin"));
  let ravenclaw = cleanStudents.filter(obj => obj.house.includes("Ravenclaw"));
  document.querySelector(
    "#total_gryffindor"
  ).innerHTML = `${gryffindor.length}`;
  document.querySelector(
    "#total_hufflepuff"
  ).innerHTML = `${hufflepuff.length}`;
  document.querySelector("#total_slytherin").innerHTML = `${slytherin.length}`;
  document.querySelector("#total_ravenclaw").innerHTML = `${ravenclaw.length}`;
}

// EXPELLING

function expelStudent(student) {
  if (student.lastName === "Krogsbøll") alert("NOT ALLOWED");
  else {
    expelledStudents.push(student);

    filterExpelledStudents(student);
  }
}

function filterExpelledStudents(expelledStudent) {
  cleanStudents = cleanStudents.filter(student => student !== expelledStudent);

  currentStudents = currentStudents.filter(
    student => student !== expelledStudent
  );

  showStudents(currentStudents);
  closePopup();
}

function changeExpelled() {
  status = this.value;
  if (status === "expelled") currentStudents = expelledStudents;
  else currentStudents = cleanStudents;

  showStudents(currentStudents);
}

// PREFECT

function makePrefect(newPrefect) {
  let prefects = currentStudents.filter(student => {
    if (student.house === newPrefect.house) {
      if (student.prefect === true) return true;
    }

    return false;
  });

  if (prefects.length < 2) newPrefect.prefect = true;
  else
    alert(
      "OOPS! There are already two prefects in this house, you must remove one before adding a new one!"
    );

  openPopup(newPrefect);
}

function removePrefect(student) {
  student.prefect = false;

  openPopup(student);
}

// INQ SQUAD

function addToInq(newMember) {
  if (isEligibleSquad(newMember)) {
    newMember.inqSquad = true;

    openPopup(newMember);
    timer(newMember);
  }
}

function isEligibleSquad(newMember) {
  return (
    newMember.bloodStatus === "Pureblood" || newMember.house === "Slytherin"
  );
}

function removeFromInq(newMember) {
  newMember.inqSquad = false;

  openPopup(newMember);
}

//HACKING

function insertMe() {
  let me = {
    firstName: "Karoline",
    middleName: "",
    lastName: "Krogsbøll",
    nickName: '"Karo"',
    house: "Hufflepuff",
    pictureName: "images/unknown.png",
    prefect: false,
    bloodStatus: "Muggleborn",
    inqSquad: false
  };

  cleanStudents.push(me);
}

function newBlood(student) {
  if (student.bloodStatus === "Pureblood")
    student.bloodStatus = randomizeBlood();
  else student.bloodStatus = "Pureblood";
}

function randomizeBlood() {
  let random = Math.floor(Math.random() * 3 + 1);

  if (random === 1) return "Pureblood";
  else if (random === 2) return "Halfblood";
  else return "Muggleborn";
}

function timer(student) {
  setTimeout(() => removeFromInq(student), 3000);
}
