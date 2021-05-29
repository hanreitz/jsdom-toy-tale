let addToy = false;
const toyCollection = document.getElementById('toy-collection');

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', e => {
        e.preventDefault();
        addNewToy(e.target);
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
});

function fetchToys() {
  fetch('http://localhost:3000/toys').
  then(response => response.json()).
  then(data => {
    data.forEach(toy => makeCard(toy))
  });
};

function makeCard(toy) {
  const toyDiv = document.createElement('div');
  toyDiv.setAttribute('class', 'card');

  const h2 = document.createElement('h2');
  h2.innerHTML = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.setAttribute('class','toy-avatar');

  const p = document.createElement('p');
  p.id = toy.name;
  p.innerHTML = toy.likes + ' likes';

  const button = document.createElement('button');
  button.setAttribute('class','like-btn');
  button.id = toy.id;
  button.innerHTML = '<3';
  button.addEventListener('click', e => {
    liker(e);
  });

  toyDiv.append(h2, img, p, button);
  toyCollection.append(toyDiv);
};

function addNewToy(formData) {

  const configurationObject = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'name': formData.name.value,
      'image': formData.image.value,
      'likes': '0'
    })
  };

  fetch('http://localhost:3000/toys', configurationObject).
  then(response => response.json()).
  then(data => makeCard(data));

};

function liker(e) {
  e.preventDefault();
  const newLikes = parseInt(e.target.previousElementSibling.innerText) + 1;

  const configurationObject = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': newLikes
    })
  };

  fetch(`http://localhost:3000/toys/${e.target.id}`, configurationObject).
  then(response => response.json()).
  then(toy => updateLikes(toy));
}

function updateLikes(toy) {
  let p = document.getElementById(`${toy.name}`);
  p.innerText = toy.likes + ' likes';
}