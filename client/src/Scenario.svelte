<script lang="ts">
  import { afterUpdate } from "svelte";
  import {
    Accordion,
    AccordionSection,
    Button,
    Card,
    H2,
    Loading,
    Tabs,
  } from "attractions";
  import Model from "./ModelViewer.svelte";
  export let data;
</script>

<Card>
  <Model {data} />
  <H2>Workers</H2>
</Card>
