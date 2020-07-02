<script context="module">
  export function preload(page) {
    return this.fetch("https://svelte-course-app.firebaseio.com/meetups.json")
      .then(res => {
        if (!res.ok) {
          throw new Error("Fecthing meetups failed, plase try again later !");
        }
        return res.json();
      })
      .then(data => {
        let loadedMeetups = [];
        for (var key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key
          });
        }
        return { loadedMeetups: loadedMeetups.reverse() };
        /*setTimeout(() => {
          isLoading = false;
          meetupStore.setMeetups(loadedMeetups.reverse()); // Fixed the order of an array to the newest key to older key
        }, 1000);*/
      })
      .catch(err => {
        error = err;
        isLoading = false;
        console.log(err);
        this.error(500, "Could not fetched meetups !");
      });
  }
</script>

<script>
  import MeetupItem from "../components/Meetup/MeetupItem.svelte";
  import MeetupFilter from "../components/Meetup/MeetupFilter.svelte";
  import Button from "../components/UI/Button.svelte";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { fade, blur, fly, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cubicIn } from "svelte/easing";
  import EditMeetup from "../components/Meetup/EditMeetup.svelte";
  import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";
  import meetupStore from "../meetups-store.js";

  export let loadedMeetups;

  let meetups = [];
  let editMode = null;
  let editedId;
  let isLoading;
  let unsuscribe;
  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly
    ? loadedMeetups.filter(m => m.isFavorite)
    : loadedMeetups;

  const setFilter = event => {
    favsOnly = event.detail === 1 ? true : false;
  };
  onMount(() => {
    meetupStore.setMeetups(loadedMeetups);
    meetupStore.subscribe(items => {
      loadedMeetups = items;
    });
  });
  onDestroy(() => {
    if (unsuscribe) {
      unsuscribe();
    }
  });
  const savedMeetup = event => {
    editMode = null;
  };
  const cancelEdit = () => {
    editMode = null;
    editedId = null;
  };
  const startAdd = () => {
    editMode = "edit";
  };
  const startEdit = event => {
    editMode = "edit";
    editedId = event.detail;
  };
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }
  #no-meetups {
    margin: 1rem;
  }
</style>

<svelte:head>
  <title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found, you can start adding some.</p>
  {/if}
  <section id="meetups">
    {#each filteredMeetups as item (item.id)}
      <div transition:fly={{ easing: cubicIn, x: 200, y: 0 }}>
        <MeetupItem
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          imgUrl={item.imgUrl}
          email={item.contactEmail}
          address={item.address}
          isFav={item.isFavorite}
          on:edit={startEdit} />
      </div>
    {/each}

  </section>
{/if}
