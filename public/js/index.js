const userData = {
	locations: {
		time9: '',
		time10: '',
		time11: '',
		time12: ''
	},
	firstName: '',
	lastName: ''
};

const backButton = document.getElementById('back-button');
const nextButton = document.getElementById('next-button');

document.addEventListener('DOMContentLoaded', async function () {
	await loadProjectsForBlock('9:00');
});

function nextTimeBlock() {
	const timeBlockElem = document.getElementById(`time-block`);
	const currentBlock = timeBlockElem.innerText.split(` `)[0];
	const locationElems = document.getElementsByName(`location`);

	// Save the location locally
	let selectedALocation;
	for (const locationElem of locationElems) {
		if (locationElem.checked) {
			selectedALocation = true;
			userData.locations[`time${currentBlock.split(':')[0]}`] = locationElem.value;
			break;
		}
	}

	// Make sure the user selected a location, otherwise don't let them pass.
	if (!selectedALocation) {
		toast('time-block-toast');
		return false;
	}

	// Clear radio buttons for the next time block.
	for (const locationElem of locationElems) {
		locationElem.checked = false;
	}

	// Load the new time block
	switch (currentBlock) {
		case `9:00`:
			timeBlockElem.innerText = `10:00 Block`;
			loadProjectsForBlock('10:00').then(() => {
				// Enable the back button
				backButton.classList.remove('disabled');
				backButton.onclick = lastTimeBlock;

				// Check for pre-existing location selection
				if (userData.locations.time10) {
					document.getElementById(userData.locations.time10).checked = true;
				}
			});
			break;
		case `10:00`:
			timeBlockElem.innerText = `11:00 Block`;
			loadProjectsForBlock('11:00').then(() => {

				// Check for pre-existing location selection
				if (userData.locations.time11) {
					document.getElementById(userData.locations.time11).checked = true;
				}
			});
			break;
		case `11:00`:
			timeBlockElem.innerText = `12:00 Block`;
			loadProjectsForBlock('12:00').then(() => {

				// Change next button to finish button.
				nextButton.innerText = 'Finish';
				nextButton.onclick = showModal;

				// Check for pre-existing location selection
				if (userData.locations.time12) {
					document.getElementById(userData.locations.time12).checked = true;
				}
			});
			break;
		default:
			// Do Nothing
			break;
	}
}

function lastTimeBlock() {
	const timeBlockElem = document.getElementById(`time-block`);
	const currentBlock = timeBlockElem.innerText.split(` `)[0];
	const locationElems = document.getElementsByName(`location`);

	// save the location locally
	for (const locationElem of locationElems) {
		if (locationElem.checked) {
			userData.locations[`time${currentBlock.split(':')[0]}`] = locationElem.value;
			break;
		}
	}

	// Load the new time block
	switch (currentBlock) {
		case `12:00`:
			timeBlockElem.innerText = `11:00 Block`;
			loadProjectsForBlock('11:00').then(() => {

				// Change finish button to next button.
				nextButton.innerText = 'Next';
				nextButton.onclick = nextTimeBlock;

				// Check for pre-existing location selection
				if (userData.locations.time11) {
					document.getElementById(userData.locations.time11).checked = true;
				}
			});
			break;
		case `11:00`:
			timeBlockElem.innerText = `10:00 Block`;
			loadProjectsForBlock('10:00').then(() => {

				// Check for pre-existing location selection
				if (userData.locations.time10) {
					document.getElementById(userData.locations.time10).checked = true;
				}
			});
			break;
		case `10:00`:
			timeBlockElem.innerText = `9:00 Block`;
			loadProjectsForBlock('9:00').then(() => {

				// Disable the back button
				backButton.classList.add('disabled');
				backButton.onclick = null;

				// Check for pre-existing location selection
				if (userData.locations.time9) {
					document.getElementById(userData.locations.time9).checked = true;
				}
			});
			break;
		default:
			// Do Nothing
			break;
	}
}

async function loadProjectsForBlock(block) {
	// remove all current projects
	const elab = document.getElementById(`elab-projects`);
	const gpac = document.getElementById(`gpac-projects`);
	const su = document.getElementById(`su-projects`);
	const art = document.getElementById(`art-projects`);

	elab.innerHTML = '';
	gpac.innerHTML = '';
	su.innerHTML = '';
	art.innerHTML = '';
	// Get the projects for the time block
	const projects = await $.get(`/presentations?time=${block}`);
	// iterate through and append the html to the correct locations
	for (const project of projects) {
		const projectHTML = `
		<div id="${project.id}" class="row project">
                    <div class="col-lg-4 col-sm-12" style="padding: 5px;">
                        <h3>${project.fields.title}</h3>
                        <span class="light">by ${project.fields.author}</span>
                        <br>
                        <span class="light">in ${project.fields.class}</span>
                    </div>
                    <div class="col-lg-8 col-sm-12 my-auto" style="background-color: #eeeeee; word-break: break-word">
                        <p>${project.fields.abstract}</p>
                    </div>
                </div>`;
		// append
		document.getElementById(`${project.fields.location}-projects`).innerHTML += projectHTML;
	}

	// populate for divs with no content
	const placeholder = `
<div class="row project">
                    <div class="col-lg-4 col-sm-12">
                        <h3>No Presentations</h3>
                        <span class="light"></span>
                        <br>
                        <span class="light"></span>
                    </div>
                    <div class="col-lg-8 col-sm-12 my-auto" style="background-color: #eeeeee;">
                        <p>There are no presentations during this time block.</p>
                    </div>
                </div>`;
	elab.innerHTML = '' === elab.innerHTML ? elab.innerHTML = placeholder : elab.innerHTML;
	gpac.innerHTML = '' === gpac.innerHTML ? gpac.innerHTML = placeholder : gpac.innerHTML;
	su.innerHTML = '' === su.innerHTML ? su.innerHTML = placeholder : su.innerHTML;
	art.innerHTML = '' === art.innerHTML ? art.innerHTML = placeholder : art.innerHTML;
}

function finalForm() {
	//todo: load the final view, which is a form that requests name, email, etc.
	// it also shows the user their location and time block selections
}

function submit() {
	//todo: submit the location data with the person's email and name.
}


function hideModal() {
	const modal = document.querySelectorAll('.modal')[0];
	modal.setAttribute('style', 'display: none');
	modal.parentNode.setAttribute('style', 'display: none');
}

function showModal() {
	const modal = document.querySelectorAll('.modal')[0];
	document.getElementsByClassName('modal-shadow')[0].onclick = () => {
		hideModal();
	};
	modal.setAttribute('style', 'display: block');
	modal.parentNode.setAttribute('style', 'display: block');
	// Define initial properties
	dynamics.css(modal, {
		opacity: 0,
		scale: .5
	});

	// Animate to final properties
	dynamics.animate(modal, {
		opacity: 1,
		scale: 1
	}, {
		type: dynamics.spring,
		frequency: 300,
		friction: 400,
		duration: 700
	});
	showModalChildren();
}

function showModalChildren() {
	const modalChildren = document.querySelectorAll('.modal')[0].children;

	// Animate each child individually
	for (let i = 0; i < modalChildren.length; i++) {
		const item = modalChildren[i];

		// Define initial properties
		dynamics.css(item, {
			opacity: 0,
			translateY: 30
		});

		// Animate to final properties
		dynamics.animate(item, {
			opacity: 1,
			translateY: 0
		}, {
			type: dynamics.spring,
			frequency: 300,
			friction: 400,
			duration: 1000,
			delay: 100 + i * 40
		});
	}
}


function toast(id, timeout) {
	const x = document.getElementById(id);
	console.log(x);
	x.className = "toast show";
	setTimeout(function () {
		x.className = x.className.replace("show", "");
	}, timeout || 5000);
}
