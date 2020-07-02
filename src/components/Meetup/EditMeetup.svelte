<script>
  import { createEventDispatcher } from "svelte";
  import meetupStore from "../../meetups-store.js";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isNotEmpty, isValidEmail } from "../../helpers/validation.js";

  export let id = null;

  let title = "";
  let subtitle = "";
  let description = "";
  let imgUrl = "";
  let address = "";
  let contactEmail = "";
  let formIsValid = false;
  if (id) {
    const unsuscribe = meetupStore.subscribe(items => {
      const selectedMeetup = items.find(i => i.id === id);
      (title = selectedMeetup.title),
        (subtitle = selectedMeetup.subtitle),
        (address = selectedMeetup.address),
        (contactEmail = selectedMeetup.contactEmail),
        (description = selectedMeetup.description),
        (imgUrl = selectedMeetup.imgUrl);
    });

    unsuscribe();
  }
  const dispatch = createEventDispatcher();
  $: titleValid = !isNotEmpty(title);
  $: subtitleValid = !isNotEmpty(subtitle);
  $: descriptionValid = !isNotEmpty(description);
  $: imgUrlValid = !isNotEmpty(imgUrl);
  $: addressValid = !isNotEmpty(address);
  $: contactEmailValid = !isNotEmpty(contactEmail);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    descriptionValid &&
    imgUrlValid &&
    contactEmailValid;

  const submitForm = () => {
    const newMeetup = {
      title: title,
      subtitle: subtitle,
      description: description,
      imgUrl: imgUrl,
      address: address,
      contactEmail: contactEmail
    };
    if (id) {
      fetch(`https://svelte-course-app.firebaseio.com/meetups/${id}.json`, {
        method: "PATCH", // PATCH only change specific field of data into an array otherwise PUT change everything into an array
        body: JSON.stringify(newMeetup),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occured, please try again !");
          }
          meetupStore.updatedMeetup(id, newMeetup);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      fetch("https://svelte-course-app.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...newMeetup, isFavorite: false }),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occured, please try again !");
          }
          return res.json();
        })
        .then(data => {
          meetupStore.addMeetup({
            ...newMeetup,
            isFavorite: false,
            id: data.name
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    dispatch("save");
  };
  const deleteMeetup = () => {
    fetch(`https://svelte-course-app.firebaseio.com/meetups/${id}.json`, {
      method: "DELETE" // DELETE remove the specific array with the id params passed into request
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("An error occured, please try again !");
        }
        meetupStore.deleteMeetup(id);
      })
      .catch(err => {
        console.log(err);
      });
    dispatch("save");
  };
  const cancel = () => {
    dispatch("cancel");
  };
</script>

<style>
  form {
    width: 100%;
    max-width: 90%;
    margin: auto;
  }
</style>

<Modal title="New Meetup" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      label="Title"
      controlType="text"
      id="title"
      value={title}
      on:input={event => (title = event.target.value)}
      valid={titleValid}
      validityMessage={'Please enter a valid title.'} />
    <TextInput
      label="Subtitle"
      controlType="text"
      id="subtitle"
      value={subtitle}
      on:input={event => (subtitle = event.target.value)}
      valid={subtitleValid}
      validityMessage={'Please enter a valid subtitle.'} />
    <TextInput
      label="Address"
      controlType="text"
      id="address"
      value={address}
      on:input={event => (address = event.target.value)}
      valid={addressValid}
      validityMessage={'Please enter a valid address.'} />
    <TextInput
      label="Image Url"
      controlType="text"
      id="imgUrl"
      value={imgUrl}
      on:input={event => (imgUrl = event.target.value)}
      valid={imgUrlValid}
      validityMessage={'Please enter a valid image url.'} />
    <TextInput
      label="Description"
      controlType="textarea"
      id="description"
      rows={10}
      value={description}
      on:input={event => (description = event.target.value)}
      valid={descriptionValid}
      validityMessage={'Please enter a valid description.'} />
    <TextInput
      label="Email"
      controlType="text"
      id="email"
      value={contactEmail}
      on:input={event => (contactEmail = event.target.value)}
      valid={contactEmailValid}
      validityMessage={'Please enter an valid email.'} />
  </form>
  <div slot="footer">
    <Button buttonType="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button buttonType="submit" on:click={submitForm} disabled={!formIsValid}>
      Save
    </Button>
    {#if id}
      <Button buttonType="button" on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>
