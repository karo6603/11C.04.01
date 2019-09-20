"use strict";

let cleanStudents = [];
let currentStudents = [];
let sort = "none";

document.addEventListener("DOMContentLoaded", start);

//   GET JSON
function start() {
  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    cleanData(await jsonData.json());
  }
  getJson();

  document.querySelector("#chosen_house").addEventListener("click", dropDown);

  document.querySelectorAll("#sort-by").forEach(option => {
    option.addEventListener("change", changeSort);
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
      if (names[1].includes("ernie")) {
        // VIRKER IKKE HJÆLP
        let nickName = names[1];
        nickName =
          nickName.substring(0, 1).toUpperCase() +
          nickName.slice(1).toLowerCase();

        let lastName = names[2];
        lastName =
          lastName.substring(0, 1).toUpperCase() +
          lastName.slice(1).toLowerCase();

        student.nickName = nickName;
        student.lastName = lastName;
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

    cleanStudents.push(student);
  });

  currentStudents = cleanStudents.slice(0);

  showStudents();

  showAmount();

  showHouseAmount(cleanStudents);
}

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: "",
  expelled: "Not expelled",
  prefect: "Not a prefect",
  bloodStatus: "idk",
  inqSquad: "no"
};

//   SHOW STUDENT LIST
function showStudents() {
  sortBy();
  let dest = document.querySelector("#list");

  dest.innerHTML = "";

  currentStudents.forEach(student => {
    let template = `
        <div class="student" style="background-image: url(images/${student.house}_wallpaper.jpg)">
        <img src=${student.pictureName}>
            <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
            <p>${student.house}</p>
        </div>`;

    dest.insertAdjacentHTML("beforeend", template);
    dest.lastElementChild.addEventListener("click", () => openStudent(student));
  });
}

// POPUP

function openStudent(student) {
  document.querySelector(".popup_content").innerHTML = `
                            <div class="student">
                            <div id="crest"><img src="images/${student.house}_crest.png"></div>
                            <img src=${student.pictureName}>
                            <div id="top">
                <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
                <p>${student.house}</p>
                <p>${student.prefect}</p>
                <p>Blood-status: ${student.bloodStatus}</p>
                <p>Inquisitorial squad: ${student.inqSquad}</p></div>
                <button class="prefect">Make prefect</button>
                <button class="inq">Add to Inquisitorial squad</button>
                <button class="expel">Expel student</button></div>      
                                </div>`;
  document.querySelector(
    "#popup"
  ).style.backgroundImage = `url(images/${student.house}_wallpaper.jpg)`;

  document.querySelector("#popup").style.width = "50%";
  document.querySelector("#close").style.display = "block";

  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector("#popup").style.width = "0%";
    document.querySelector("#close").style.display = "none";
  });
}

// SORTING (HAT)

function changeSort() {
  sort = this.value;
  showStudents();
}

function sortBy() {
  if (sort == "Firstname")
    currentStudents.sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
  else if (sort == "Lastname")
    currentStudents.sort((a, b) => {
      return a.lastName.localeCompare(b.lastName);
    });
  else if (sort == "House")
    currentStudents.sort((a, b) => {
      return a.house.localeCompare(b.house);
    });
}

//   FILTER

function dropDown() {
  document.querySelector(".house_content").classList.toggle("show");

  document.querySelectorAll(".house").forEach(house => {
    house.addEventListener("click", filterByHouse);
  });
}

function filterByHouse() {
  let house = this.getAttribute("value");

  document.querySelector(".house_content").classList.toggle("show");

  document.querySelector(
    "#chosen_house"
  ).innerHTML = `<img src="images/${house}_crest.png"><i class="fa fa-angle-down">`;

  studentsInHouse(house);
}

function studentsInHouse(house) {
  currentStudents = cleanStudents.filter(s => {
    if (s.house === house) return true;
    else if (house === "All") return true;
    else return false;
  });

  showStudents();
}

// SHOW DETAILS

function showAmount() {
  document.querySelector(
    "#total"
  ).innerHTML = `Total number of students: ${cleanStudents.length}`;
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
