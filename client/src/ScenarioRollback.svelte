<script lang="ts">
  import {
    Button,
    Card,
    CheckboxGroup,
    H2,
    Loading,
    TextField,
  } from "attractions";
  import { prevent_default } from "svelte/internal";

  import Model from "./ModelViewer.svelte";

  export let data;
  let busy = false;
  let customerCharge = 10;

  const metadataItems = [
    {
      value: "chargeSucceed",
      label: "Charge succeeds",
      checked: true,
    },
    {
      value: "shippingSucceed",
      label: "Shipping succeeds",
      checked: true,
    },
  ];

  function createInstance() {
    busy = true;
    fetch("/rollback", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: {
          customerCharge,
          ...metadataItems.reduce(
            (prev, f) => ({ ...prev, [f.value]: f.checked }),
            {}
          ),
        },
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
  <CheckboxGroup name="attachment" items={metadataItems} />
  <TextField
    withItem
    type="number"
    outline
    label="Customer charge"
    bind:value={customerCharge}
  >
    <span class="item dollar">$</span>
  </TextField>
  {#if busy}
    <Loading />
  {:else}
    <Button outline on:click={createInstance}>Create Process Instance</Button>
  {/if}
</Card>
