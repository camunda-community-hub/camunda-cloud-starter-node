<script lang="ts">
  import { Button, Card, CheckboxGroup, H2 } from "attractions";

  import Model from "./ModelViewer.svelte";

  export let data;

  const hasAttachmentCheckbox = [
    {
      value: "hasAttachment",
      label: "Payload has attachment?",
      checked: false,
    },
  ];

  function createInstance() {
    fetch("/decisionGateway", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hasAttachment: hasAttachmentCheckbox[0].checked }),
    }).then((res) =>
      res.json().then((r) => {
        console.log(r);
        alert(JSON.stringify(r, null, 2));
      })
    );
  }
</script>

<Card>
  <Model {data} />
  <H2>Create Process Instance</H2>
  <CheckboxGroup name="attachment" items={hasAttachmentCheckbox} />

  <Button outline on:click={createInstance}>Create Process Instance</Button>
</Card>
