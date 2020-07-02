<script>
  import Modal from "./Modal.svelte";
  import Button from "./Button.svelte";
  import { createEventDispatcher } from "svelte";
  export let message;
  const dispatch = createEventDispatcher();
</script>

<Modal title="An error occured !" on:cancel>
  <p>{message}</p>
  <Button>Close</Button>
</Modal>
