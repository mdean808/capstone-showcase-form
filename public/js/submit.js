let userData;
document.addEventListener('DOMContentLoaded', async function () {
	const urlParams = new URLSearchParams(window.location.search);
	const data = urlParams.get('data');
	userData = JSON.parse(data);
	document.getElementById('9-location').innerText = getFullLocationName(userData.locations.time9);
	document.getElementById('10-location').innerText = getFullLocationName(userData.locations.time10);
	document.getElementById('11-location').innerText = getFullLocationName(userData.locations.time11);
	document.getElementById('12-location').innerText = getFullLocationName(userData.locations.time12);
});

function getFullLocationName(name) {
	console.log(name);
	if (name === 'elab') return 'Energy Lab';
	else if (name === 'su') return 'Student Union';
	else if (name === 'gpac') return 'Gates Performing Arts Center';
	else if (name === 'art') return 'Art Center';
	else if (name === 'garden') return 'Outdoor Classroom';
	else if (name === 'castle') return 'Castle Lecture Hall';
	else if (name === 'science') return 'Science Building';
	else return name;
}

async function submit() {
	userData.email = document.getElementById('email').value;
	userData.firstName = document.getElementById('first').value;
	userData.lastName = document.getElementById('last').value;
	const res = await $.post('/submit', {data: JSON.stringify(userData)});
	if (res === '1') {
		window.location.href = '/success.html';
	} else {
		toast('time-block-toast');
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
