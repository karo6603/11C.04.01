"use strict";

document.addEventListener("DOMContentLoaded", start);

let allStudents = [];

//   get json
function start() {
  document.querySelector("select").addEventListener("change", value);

  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json"
    );

    allStudents = await jsonData.json();
    showStudent(allStudents);
  }
  getJson();
}

//   show student list
function showStudent(allStudents) {
  let dest = document.querySelector("#list");

  dest.innerHTML = "";

  if (value() === "All") {
    console.log(allStudents);

    allStudents.forEach(student => {
      dest.innerHTML += `
              <div class="student">
                  <h2>${student.fullname}</h2>
                  <p>${student.house}</p>
              </div>`;
    });
  } else {
    let filteredStudents = studentsInHouse(value());
    console.log(filteredStudents);

    filteredStudents.forEach(filterStudent => {
      dest.innerHTML += `
                  <div class="student">
                      <h2>${filterStudent.fullname}</h2>
                      <p>${filterStudent.house}</p>
                  </div>`;
    });
  }
}

// clean data

// const studentData = {
//   firstName: "",
//   middleName: "",
//   lastName: "",
//   nickName: "",
//   house: "",
//   pictureName: ""
// };

// function cleanData(data) {
//   data.forEach(jsonObject => {
//     const student = object.create(studentData);

//     const str = student.split(" ");

//     const firstName =
//       str[0].charAt(0).toUpperCase() + str[0].slice(1).toLowerCase();
//     const middleName =
//       str[1].charAt(0).toUpperCase() + str[1].slice(1).toLowerCase();
//     const lastName =
//       str[2].charAt(0).toUpperCase() + str[2].slice(1).toLowerCase();

//     return { firstName, middleName, lastName };
//   });
// }

function value() {
  let house = document.querySelector("#house_picker").value;

  console.log(house);

  return house;
}

console.log(value());

function studentsInHouse(house) {
  const students = allStudents.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === house) {
      return true;
    } else {
      return false;
    }
  }
  return students;
}
