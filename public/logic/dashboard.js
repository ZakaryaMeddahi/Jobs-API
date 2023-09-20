import request from "./modules/request.js";

let id;
const logout = document.getElementById('logout-link');

logout.onclick = () => {
  window.addEventListener('click', () => {
    window.location.reload();
  });
}

/* Display Popup */
const newJobPopup = (status, role, event) => {
  console.log(`Status: ${status}, Role: ${role}, Event: ${event}`);
  const value = status === 'display' ? 'block' : 'none';
  const index = role === 'add' ? 0 : role === 'update' ? 1 : 2;
  if(event) {
    id = event.target.parentElement.parentElement.dataset.id;
  }
  const popup = document.querySelectorAll('.popup');
  const overlay = document.querySelector('.overlay');
  popup[index].style.display = value;
  overlay.style.display = value;
}
/****************/

/* Listen To Clicks */
const newJob = document.getElementById('new-job-button');
newJob.onclick = () => {
  newJobPopup('display', 'add');
}

const jobs = document.querySelectorAll('#modify-job');
jobs.forEach(job => {
  job.addEventListener('click', e => {
    newJobPopup('display', 'update', e);
  });
});


const closePopups = document.querySelectorAll('.close');
const status = ['add', 'update', 'delete'];
for (let i = 0; i < closePopups.length; i++) {
  closePopups[i].addEventListener('click', e => {
    newJobPopup('close', status[i]);
  })
}

const overlay = document.querySelector('.overlay');
overlay.onclick = () => {
  newJobPopup('close', 'add');
  newJobPopup('close', 'update');
  newJobPopup('close', 'delete');
}
/***************/

/* Create Elements */
const createJobCard = (job) => {
  return `
    <div>
      <h2 class="company-name">${ job.company }</h2>
      <p class="position">Position: 
        <span class="position-value">${ job.position }</span>
      </p>
      <p class="status">Status: 
        <span class="status-value">${ job.status }</span>
      </p>
    </div>
    <div class="buttons">
      <button id="modify-job">modify</button>
      <button id="remove-job">remove</button>
    </div>
  `
}
const newJobCard = (job) => {
  const jobsConatiner = document.getElementById('jobs-container');
  const jobCard = document.createElement('div');
  jobCard.className = 'job';
  jobCard.dataset.id = job._id;
  if(jobsConatiner.querySelector('.no-jobs')) {
    jobsConatiner.innerHTML = '';
  }
  jobCard.innerHTML += createJobCard(job);
  const modifyButton = jobCard.querySelector('#modify-job');
  modifyButton.addEventListener('click', e => {
    newJobPopup('display', 'update', e);
  });
  const removeButton = jobCard.querySelector('#remove-job');
  removeButton.addEventListener('click', e => {
    newJobPopup('display', 'delete', e);
  });
  jobsConatiner.append(jobCard);
}

const updateJobCard = (data) => {
  const job = document.querySelector(`[data-id='${id}']`);
  const newCompany = job.querySelector(`.company-name`);
  const position = job.querySelector('.position-value');
  const status = job.querySelector('.status-value');
  const updatedJob = data.updatedJob;
  newCompany.innerHTML = updatedJob.company;
  position.innerHTML = updatedJob.position;
  status.innerHTML = updatedJob.status;
}

const removeJobCard = () => {
  const jobCard = document.querySelector(`[data-id='${id}']`);
  jobCard.remove();
  const jobsConatiner = document.getElementById('jobs-container');
  if(!jobsConatiner.childNodes.length) {
    const h2 = document.createElement('h2');
    h2.className = 'no-jobs';
    h2.innerHTML = 'No Jobs';
    jobsConatiner.prepend(h2);
  }
}
/*******************/

/* Send Requests */
const createJob = document.getElementById('create-job');
createJob.onclick = (event) => {
  event.preventDefault();
  const company = document.getElementById('company').value;
  const position = document.getElementById('position').value;
  const status = document.getElementById('status').value;
  request('/api/v1/jobs', 'POST', { company, position, status })
  .then(response => {
    if(!response) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    return response.json();
  })
  .then(data => {
    newJobCard(data.job);
    newJobPopup('close', 'add');
  })
  .catch(err => {
    throw err;
  })
}

const updateJob = document.getElementById('update-job');
updateJob.onclick = (event) => {
  event.preventDefault();
  const company = document.getElementById('new-company').value;
  const position = document.getElementById('new-position').value;
  const status = document.getElementById('new-status').value;
  request(`/api/v1/jobs/${id}`, 'PATCH', { company, position, status })
  .then(response => {
    if(!response) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    return response.json();
  })
  .then(data => {
    updateJobCard(data);
    newJobPopup('close', 'update');
  })
  .catch(err => {
    throw err;
  })
}

const removeJob = document.querySelectorAll('#remove-job');
removeJob.forEach(job => {
  job.addEventListener('click', e => {
    newJobPopup('display', 'delete', e);
  });
});

const deleteJob = document.getElementById('delete-job');
deleteJob.onclick = (event) => {
  event.preventDefault();
  request(`/api/v1/jobs/${id}`, 'DELETE')
  .then(response => {
    if(!response) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    return response.json();
  })
  .then(data => {
    removeJobCard();
    newJobPopup('close', 'delete');
  })
  .catch(err => {
    throw err;
  })
}

const getJobs = document.getElementById('search');
getJobs.onclick = (event) => {
  event.preventDefault();
  const searchinput = document.getElementById('search-input');
  request(`/api/v1/jobs?company=${searchinput.value}`, 'GET')
  .then(response => {
    if(!response.ok) {
      throw new Error(`Can't get jobs`);
    }
    return response.json();
  })
  .then(data => {
    const jobsContainer = document.getElementById('jobs-container');
    jobsContainer.innerHTML='';
    data.jobs.forEach(job => {
      newJobCard(job);
    })
  })
  .catch(err => {
    throw err;
  })
}
