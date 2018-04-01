const BASEURL = 'https://3ebbf85c.ngrok.io';

export function getEvents(page) {
  return fetch(`${BASEURL}/events?page=${page}`)
    .then((response) => response.json());
}

export function getEvent(eventId) {
  return fetch(`${BASEURL}/events/${eventId}`)
    .then((response) => response.json())
}
