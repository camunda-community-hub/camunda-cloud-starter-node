<script lang="ts">
  import {
    Accordion,
    AccordionSection,
    Button,
    Card,
    H2,
    Loading,
    Tabs,
  } from "attractions";
  import { ChevronDownIcon } from "svelte-feather-icons";
  import ScenarioSendEmail from "./ScenarioSendEmail.svelte";
  import ScenarioDecision from "./ScenarioDecision.svelte";
  import ScenarioParallelMultiInstance from "./ScenarioParallelMultiInstance.svelte";

  const ScenarioComponents = {
    "Send Email": ScenarioSendEmail,
    "Decision Gateway": ScenarioDecision,
    "Parallel Multi-instance": ScenarioParallelMultiInstance,
  };

  async function getClientCredentials() {
    const res = await fetch("/camundaCloudClusterConnection");
    return res.json();
  }
  export let promise = getClientCredentials();

  let scenarioPromise = fetch("/scenarios").then((res) => res.json());
  let files;
  let dataFile = null;
  let selectedTab = "Send Email";

  function uploadCredentials() {
    const formData = new FormData();
    formData.append("credentials", files[0]);
    const upload = fetch("/camundaCloudClusterCredentials", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => window.location.reload())
      .catch((error) => {
        console.error("Error:", error);
      });
  }
</script>

<main>
  <h1>Camunda Cloud Get Started</h1>

  {#await promise}
    <Loading />
    <p>...waiting for Camunda Cloud</p>
  {:then connection}
    {#if !connection.exists}
      <p>Configure Camunda Cloud client credentials.</p>
      <p>
        <a
          href="https://docs.camunda.io/docs/product-manuals/cloud-console/manage-clusters/manage-api-clients"
        >
          Create an API client for your Camunda Cloud cluster</a
        >, and upload the credentials .txt file here:
      </p>
      <input id="fileUpload" type="file" bind:files />
      {#if dataFile && files[0]}
        <p>
          {files[0].name}
        </p>
      {/if}
      {#if files}
        <button on:click={uploadCredentials}>Upload</button>
      {:else}
        <button on:click={uploadCredentials} disabled>Upload</button>
      {/if}
      <p>
        <i
          >Uploading the credentials will write them into the .env file in the
          project.</i
        >
      </p>
    {:else}
      <Accordion let:closeOtherPanels>
        <AccordionSection on:panel-open={closeOtherPanels} let:toggle>
          <div slot="handle">
            <Button on:click={toggle}>
              Connected to Camunda Cloud
              <ChevronDownIcon size="20" class="ml accordion-chevron" />
            </Button>
          </div>
          <Card>
            <Button outline on:click={() => (connection.exists = false)}
              >Upload new client credentials</Button
            >
            <H2>Topology</H2>
            <pre>{JSON.stringify(connection.topology, null, 2)}</pre>
          </Card>
        </AccordionSection>
      </Accordion>
      {#await scenarioPromise}
        <Loading />
      {:then scenarios}
        <Tabs
          name="scenarios"
          items={scenarios.scenarioNames}
          bind:value={selectedTab}
        />
        <svelte:component
          this={ScenarioComponents[selectedTab]}
          data={scenarios.scenarios[selectedTab]}
        />
      {/await}
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  pre {
    text-align: left;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
