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
  import BpmnViewer from "bpmn-js";
  let viewer;
  export let data;
  afterUpdate(() => {
    // create a modeler
    if (!viewer) {
      viewer = new BpmnViewer({ container: "#canvas" });
    }

    // import diagram
    if (data?.bpmnXML) {
      viewer.importXML(data.bpmnXML).then(() => {
        const canvas = viewer.get("canvas");
        canvas.zoom("fit-viewport");
      });
    }
  });
</script>

<H2>Model</H2>
<div>
  <div id="canvas" />
</div>
