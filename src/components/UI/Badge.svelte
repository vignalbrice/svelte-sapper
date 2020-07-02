<script>
  import { fade, blur, fly, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cubicInOut } from "svelte/easing";
</script>

<style>
  span {
    display: inline-block;
    margin: 0 0.25rem;
    border-radius: 3px;
    border: 1px solid #cf0056;
    background: #cf0056;
    color: white;
    padding: 0 0.5rem;
    font-family: "Lato" sans-serif;
    font-size: 1.8rem;
  }
</style>

<span
  in:scale={{ easing: cubicInOut, duration: 300 }}
  out:scale={{ easing: cubicInOut, duration: 300 }}>
  <slot />
</span>
