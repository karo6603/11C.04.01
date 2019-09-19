"use strict";

document.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let cleanStudents = [];
let sort;

document.querySelectorAll("#sort-by").forEach(option => {
  option.addEventListener("change", sortBy);
});

document.querySelector("#house_picker").addEventListener("change", showStudent);

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
      student.lastName = "Unknown";
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
    } else if (firstName === "Leanne") {
      let photoName = `images/${names[0].toLowerCase()}.png`;

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
}

const studentData = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  house: "",
  pictureName: ""
};

//   show student list
function showStudent(cleanStudents) {
  let selectedHouse = document.querySelector("#house_picker").value;
  let dest = document.querySelector("#list");

  console.log(cleanStudents);
  dest.innerHTML = "";

  if (selectedHouse === "All") {
    cleanStudents.forEach(student => {
      dest.innerHTML += `
        <div class="student">
        <img src=${student.pictureName}>
            <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
            <p>${student.house}</p>
        </div>`;
    });
  } else {
    let filteredStudents = studentsInHouse(selectedHouse);
    filteredStudents.forEach(filterStudent => {
      dest.innerHTML += `
        <div class="student">
        <img src=${filterStudent.pictureName}>
            <h2>${filterStudent.firstName} ${filterStudent.middleName} ${filterStudent.lastName}</h2>
            <p>${filterStudent.house}</p>
        </div>`;
    });
  }
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

function studentsInHouse(selectedHouse) {
  const students = cleanStudents.filter(filterFunction);
  function filterFunction(student) {
    if (student.house === selectedHouse) {
      return true;
    } else {
      return false;
    }
  }
  return students;
}
