<script>
  import Button from "../UI/Button.svelte";
  import Badge from "../UI/Badge.svelte";
  import meetupStore from "../../meetups-store.js";
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from "../UI/LoadingSpinner.svelte";
  export let id;
  export let title;
  export let subtitle;
  export let description;
  export let imgUrl;
  export let address;
  export let isFav;

  let isLoading = false;

  const dispatch = createEventDispatcher();

  const toggleFavorite = () => {
    isLoading = true;
    fetch(`https://svelte-course-app.firebaseio.com/meetups/${id}.json`, {
      method: "PATCH", // PATCH only change specific field of data into an array otherwise PUT change everything into an array
      body: JSON.stringify({ isFavorite: !isFav }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("An error occured, please try again !");
        }
        isLoading = false;
        meetupStore.toggleFavorite(id);
      })
      .catch(err => {
        isLoading = false;
        console.log(err);
      });
  };
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
  .content {
    height: 4rem;
  }
</style>

<article>
  <header>
    <h1>
      {title}
      {#if isFav}
        <Badge>&#x2764;</Badge>
      {/if}
    </h1>
    <h2>{subtitle}</h2>

    <p>{address}</p>
  </header>
  <div class="image">
    <img src={imgUrl} alt={title} />
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button mode="outline" type="button" on:click={() => dispatch('edit', id)}>
      Edit Meetup
    </Button>
    {#if isLoading}
      <!--<LoadingSpinner />-->
      <span>Changing...</span>
    {:else}
      <Button
        mode="outline"
        type="button"
        color={isFav ? null : 'success'}
        on:click={toggleFavorite}>
        {isFav ? 'Unfavorite' : 'Favorite'}
      </Button>
    {/if}

    <Button href="/{id}">Show Details</Button>
  </footer>
</article>
