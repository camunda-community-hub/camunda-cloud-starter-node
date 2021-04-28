<script lang="ts">
  import { Button, Card, CheckboxGroup, H2, Loading } from "attractions";

  import Model from "./ModelViewer.svelte";

  export let data;
  let busy = false;

  const fileItems = [
    {
      value: "file1",
      label: "File 1",
      checked: false,
    },
    {
      value: "file2",
      label: "File 2",
      checked: false,
    },
    {
      value: "file3",
      label: "File 3",
      checked: false,
    },
    {
      value: "file4",
      label: "File 4",
      checked: false,
    },
    {
      value: "file5",
      label: "File 5",
      checked: false,
    },
    {
      value: "file6",
      label: "File 6",
      checked: false,
    },
    {
      value: "file7",
      label: "File 7",
      checked: false,
    },
  ];

  function createInstance() {
    busy = true;
    fetch("/parallelMultiInstance", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: fileItems.filter((f) => f.checked).map((f) => f.value),
      }),
    }).then((res) =>
      res.json().then((r) => {
        console.log(r);
        busy = false;
        alert(JSON.stringify(r, null, 2));
      })
    );
  }
</script>

<Card>
  <Model {data} />
  <H2>Create Process Instance</H2>
  <CheckboxGroup name="attachment" items={fileItems} />

  {#if busy}
    <Loading />
  {:else}
    <Button outline on:click={createInstance}>Create Process Instance</Button>
  {/if}
</Card>
