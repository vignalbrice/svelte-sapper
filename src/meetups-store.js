import { writable } from "svelte/store";

const meetups = writable([]);

const actions = {
  subscribe: meetups.subscribe,
  setMeetups: (meetup) => {
    meetups.set(meetup);
  },
  addMeetup: (meetupData) => {
    const newMeetup = {
      ...meetupData,
      // id: Math.random(),
      // isFavorite: false,
    };
    meetups.update((meetup) => {
      return [...meetup, newMeetup];
    });
  },
  updatedMeetup: (id, meetupData) => {
    meetups.update((meetup) => {
      const meetupIndex = meetup.findIndex((i) => i.id === id);
      const updatedMeetup = { ...meetup[meetupIndex], ...meetupData };
      const updatedMeetups = [...meetup];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  deleteMeetup: (id) => {
    meetups.update((meetup) => {
      return meetup.filter((item) => item.id !== id);
    });
  },
  toggleFavorite: (id) => {
    meetups.update((meetup) => {
      const updatedMeetup = { ...meetup.find((m) => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = meetup.findIndex((m) => m.id === id);
      const updatedMeetups = [...meetup];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
};
export default actions;
