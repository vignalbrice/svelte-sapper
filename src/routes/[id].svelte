<script context="module">
  export function preload(page) {
    const meetupId = page.params.id;
    return this.fetch(
      `https://svelte-course-app.firebaseio.com/meetups/${meetupId}.json`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Fecthing meetups failed, plase try again later !");
        }
        return res.json();
      })
      .then(meetups => {
        return { meetups: { ...meetups, id: meetupId } };
      })
      .catch(err => {
        this.errpr(404, "Could not fetch meetup !");
      });
  }
</script>

<script>
  import Button from "../components/UI/Button.svelte";
  import meetupStore from "../meetups-store";
  export let meetups;
</script>

<style>
  section {
    margin-top: 4rem;
  }

  .image {
    width: 100%;
    height: 25rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image {
    background: #e7e7e7;
  }

  .content {
    text-align: center;
    width: 80%;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    font-family: "Roboto Slab", sans-serif;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.25rem;
    color: #6b6b6b;
  }

  p {
    font-size: 1.5rem;
  }
</style>

<svelte:head>
  <title>{meetups.title}</title>
</svelte:head>
<section>
  <div class="image">
    <img src={meetups.imgUrl} alt={meetups.title} />
  </div>
  <div class="content">
    <h1>{meetups.title}</h1>
    <h2>{meetups.subtitle} - {meetups.address}</h2>
    <p>{meetups.description}</p>
    <Button href="mailto:{meetups.contactEmail}">Contact</Button>
    <Button mode="outline" href="/">Close</Button>
  </div>
</section>
