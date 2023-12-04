const COHORT = "2310-fsa-et-web-pt-sf-b-christopher";
const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/" + COHORT;

const state = {
    events: [],
}

const $partiesList = document.querySelector("#parties");
const $addEvent = document.querySelector("#addEvent");

$addEvent.addEventListener("submit", addParty);

async function render() {
    await getEvents();
    renderEvents();
}

render();

async function getEvents() {
    // TODO
    try {
        const response = await fetch(API + "/events");
        const responseJson = await response.json();
        state.events = responseJson.data;
    } catch (err) {
        console.error(err.message);
    }
}

function renderEvents() {
    // TODO
    if (!state.events.length) {
        $partiesList.innerHTML = "<li>No events to be found</li>";
        return;
    }
    const eventInfor = state.events.map((event) => {
        const li = document.createElement("li")
        const deleteButton = document.createElement("button")

        deleteButton.textContent = "Remove Party";

        li.innerHTML = `
        <h2>${event.name}</h2>     
        <p>${event.description}</p>
        <p>Event Date: ${event.date}</p>
        <p>Event Location: ${event.location}</p>
        `;

        li.appendChild(deleteButton);

        deleteButton.addEventListener('click', () => {
            removeParty(event.id)
        })
        return li;
    })
    $partiesList.replaceChildren(...eventInfor);
}

async function addParty(event) {
    try {
        const dateISO = new Date(event.target.date.value);
        const dateNew = dateISO.toISOString();
        const eventOBJ = JSON.stringify({
            name: event.target.name.value,
            description: event.target.description.value,
            date: dateNew,
            location: event.target.location.value
        })

        const newEvent = await fetch(API + "/events",
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: eventOBJ,
            });
        const result = await newEvent.json();
        console.log(result);
        render();
    } catch (error) {
        console.error(error.message);
    }
}

async function removeParty(eventId) {
    try {
        const response = await fetch(
            API + "/events/" + eventId,
            {
                method: 'DELETE',
            }
        );
        render();
        // Attempted to pull the result with the below but was recieving and error: SyntaxError: Unexpected end of JSON input
        // const result = await response.json();
        // console.log(result);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${eventId} from the roster!`,
            err
        );
    }
};