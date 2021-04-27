<script lang="ts">
  import {
    Accordion,
    AccordionSection,
    Button,
    Card,
    H2,
    Loading,
    SnackbarContainer,
    Tabs,
    TextField,
  } from "attractions";
  import { ChevronDownIcon } from "svelte-feather-icons";

  import Model from "./ModelViewer.svelte";
  export let data;
  let name;
  let email;

  function createInstance() {
    fetch("/sendEmail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    }).then((res) => res.json().then((r) => console.log(r)));
  }

  async function getSendGridApiKey(): Promise<boolean> {
    const res = await fetch("/sendGridApiKey");
    const { exists } = await res.json();
    return exists;
  }

  async function getSendGridSenderEmail() {
    const res = await fetch("/sendGridSenderEmail");
    const { senderEmail } = await res.json();
    return senderEmail;
  }

  let sendGridApiKeyPromise = getSendGridApiKey();
  let sendGridSenderEmailPromise = getSendGridSenderEmail();
  let newSendGridSenderEmail = "";
  let newSendGridApiKey = "";
  let snackbar;
  let apiKeyDropDown;
  let senderEmailDropDown;

  function setSendGridSenderEmail() {
    fetch("/sendGridSenderEmail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderEmail: newSendGridSenderEmail }),
    }).then(() => {
      snackbar.showSnackbar({
        props: { text: "Sendgrid Sender Email updated!" },
      });
    });
  }

  function setSendGridApiKey() {
    fetch("/sendGridApiKey", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: newSendGridApiKey }),
    }).then(() => {
      snackbar.showSnackbar({ props: { text: "Sendgrid API key updated!" } });
    });
  }
</script>

<Card>
  <Accordion let:closeOtherPanels>
    <AccordionSection
      bind:this={apiKeyDropDown}
      on:panel-open={closeOtherPanels}
      let:toggle
    >
      <div slot="handle">
        <Button on:click={toggle}>
          Sendgrid API Key
          <ChevronDownIcon size="20" class="ml accordion-chevron" />
        </Button>
      </div>
      <Card>
        {#await sendGridApiKeyPromise}
          <Loading />
        {:then sendGridApiKey}
          {#if sendGridApiKey}
            <TextField
              outline
              label="API Key"
              placeholder="API key is set"
              bind:value={newSendGridApiKey}
            />
          {:else}
            <TextField outline label="API Key" bind:value={newSendGridApiKey} />
          {/if}
        {/await}
        {#if newSendGridApiKey}
          <Button outline on:click={setSendGridApiKey}
            >Update Sendgrid API Key</Button
          >
        {:else}
          <Button outline on:click={setSendGridApiKey} disabled
            >Update Sendgrid API Key</Button
          >
        {/if}
      </Card>
    </AccordionSection>
    <AccordionSection
      bind:this={senderEmailDropDown}
      on:panel-open={closeOtherPanels}
      let:toggle
    >
      <div slot="handle">
        <Button on:click={toggle}>
          Sendgrid Sender Email
          <ChevronDownIcon size="20" class="ml accordion-chevron" />
        </Button>
      </div>
      <Card>
        {#await sendGridSenderEmailPromise}
          <Loading />
        {:then sendGridSenderEmail}
          {#if sendGridSenderEmail}
            <TextField
              outline
              label="Sender Email"
              placeholder={sendGridSenderEmail}
              bind:value={newSendGridSenderEmail}
            />
          {:else}
            <TextField
              outline
              label="Sender Email"
              bind:value={newSendGridSenderEmail}
            />
          {/if}
        {/await}
        {#if newSendGridSenderEmail}
          <Button outline on:click={setSendGridSenderEmail}
            >Update Sendgrid Sender Email</Button
          >
        {:else}
          <Button outline on:click={setSendGridSenderEmail} disabled
            >Update Sendgrid Sender Email</Button
          >
        {/if}
      </Card>
    </AccordionSection>
  </Accordion>
  <SnackbarContainer bind:this={snackbar} let:showSnackbar />

  <Model {data} />
  <H2>Create Process Instance</H2>
  <TextField
    outline
    label="Name"
    placeholder="Name of the recipient"
    bind:value={name}
  />
  <TextField
    outline
    label="Email"
    placeholder="Email to send to"
    bind:value={email}
  />
  {#if name && email}
    <Button outline on:click={createInstance}>Create Process Instance</Button>
  {:else}
    <Button outline on:click={createInstance} disabled
      >Create Process Instance</Button
    >
  {/if}
</Card>
