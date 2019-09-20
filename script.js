//fjern det valgte hus?
//baggrunde
//oprydning i funktioner - de skal helst bare gøre en ting
//popup ud af showstudent

"use strict";

let allStudents = [];
let cleanStudents = [];
let sort;
let house = "All";

document.addEventListener("DOMContentLoaded", start);

//   get json
function start() {
  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    allStudents = await jsonData.json();
    cleanData(allStudents);
  }
  getJson();

  document.querySelector("#chosen_house").addEventListener("click", dropDown);

  document.querySelectorAll("#sort-by").forEach(option => {
    option.addEventListener("change", sortBy);
  });
}

// clean data

function cleanData(allStudents) {
  allStudents.forEach(jsonObject => {
    const student = Object.create(studentData);

    // NAMES

    const nametrim = jsonObject.fullname.trim();

    let names = nametrim.split(" ");

    let firstName = names[0];

    firstName =
      firstName.substring(0, 1).toUpperCase() +
      firstName.slice(1).toLowerCase();

    student.firstName = firstName;

    if (names.length == 2) {
      let lastName = names[1];
      lastName =
        lastName.substring(0, 1).toUpperCase() +
        lastName.slice(1).toLowerCase();

      student.lastName = lastName;
    } else if (names.length == 3) {
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
        let middleName = names[1];
        middleName =
          middleName.substring(0, 1).toUpperCase() +
          middleName.slice(1).toLowerCase();

        let lastName = names[2];
        lastName =
          lastName.substring(0, 1).toUpperCase() +
          lastName.slice(1).toLowerCase();

        student.middleName = middleName;
        student.lastName = lastName;
      }
    } else {
      student.lastName = "";
    }

    // HOUSES

    let house = jsonObject.house.trim();

    house = house.substring(0, 1).toUpperCase() + house.slice(1).toLowerCase();

    student.house = house;

    // PHOTOS

    if (firstName === "Justin") {
      let lastName = names[1].substring(6, names[1].length);

      let photoName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      student.pictureName = photoName;
    } else if (names.length === 1) {
      let photoName = `images/unknown.png`;

      student.pictureName = photoName;
    } else if (firstName === "Padma") {
      let lastName = names[1].toLowerCase();

      lastName = lastName.toLowerCase();

      let photoName = `images/${lastName}_${names[0]
        .substring(0, 4)
        .toLowerCase()}e.png`;

      student.pictureName = photoName;
    } else if (firstName === "Parvati") {
      let lastName = names[1].toLowerCase();

      lastName = lastName.toLowerCase();

      let photoName = `images/${lastName}_${names[0].toLowerCase()}.png`;

      student.pictureName = photoName;
    } else if (names.length == 2) {
      let lastName = names[1];

      lastName = lastName.toLowerCase();

      let photoName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      student.pictureName = photoName;
    } else if (names.length == 3) {
      let lastName = names[2];

      lastName = lastName.toLowerCase();

      let photoName = `images/${lastName}_${names[0]
        .substring(0, 1)
        .toLowerCase()}.png`;

      student.pictureName = photoName;
    }

    cleanStudents.push(student);
  });
  showStudent(cleanStudents);
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

//   show student list
function showStudent(students) {
  let dest = document.querySelector("#list");

  console.log(students);

  dest.innerHTML = "";

  students.forEach(student => {
    let template = `
        <div class="student">
        <img src=${student.pictureName}>
            <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
            <p>${student.house}</p>
        </div>`;

    dest.insertAdjacentHTML("beforeend", template);

    dest.lastElementChild.addEventListener("click", openStudent);

    function openStudent() {
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
                  

                                  </div>
                              `;
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

    document.querySelectorAll(".student").forEach(bcg => {
      bcg.style.backgroundImage = `url(images/${student.house}_wallpaper.jpg)`;
    });
  });
}

// SORTING (HAT)

function sortBy() {
  sort = this.value;

  if (sort == "Firstname") {
    cleanStudents.sort(function(a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "Lastname") {
    cleanStudents.sort(function(a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "House") {
    cleanStudents.sort(function(a, b) {
      return a.house.localeCompare(b.house);
    });
  } else if (sort == "none") {
    start();
  }

  showStudent(cleanStudents);
}

// FILTERING VIRKER IKKE ENDNU
//   show student list

function dropDown() {
  document.querySelector(".house_content").classList.toggle("show");

  document.querySelectorAll(".house").forEach(house => {
    house.addEventListener("click", filterByHouse);
  });
}

function filterByHouse() {
  house = this.getAttribute("value");

  document.querySelector(".house_content").classList.toggle("show");

  // FJERN VALGTE HUS

  document.querySelector(
    "#chosen_house"
  ).innerHTML = `<img src="images/${house}_crest.png"><i class="fa fa-angle-down">`;

  studentsInHouse(house);
}

function studentsInHouse(house) {
  const students = cleanStudents.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === house) {
      return true;
    } else if (house === "All") {
      return true;
    } else {
      return false;
    }
  }
  showStudent(students);
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
