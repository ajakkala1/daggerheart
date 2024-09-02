/**
 * Represents a document which can be attached to a Svelte Component
 */
export type SvelteSheet<T> = {
  getData: () => T;
  document: foundry.abstract.Document<any, any>;
};

/**
 * Represents a SvelteComponent which can be created by calling new() on it
 */
export type SvelteComponent = {
  new (): any;
};

/**
 * Injects the provided Svelte Component into the first form in the HTML provided. Uses the sheet provided
 * to provide data and update the component.
 * @param sheet - A sheet instance. Must have access to a foundry document and implement getData()
 * @param svelteComponent - A svelte component to inject
 * @param html - Html node that will house the svelte component
 */
export function injectSvelteComponent<T>(
  sheet: SvelteSheet<T>,
  svelteComponent: SvelteComponent,
  html: JQuery,
) {
  // Placeholder reference to the Svelte Component
  let app: any;
  let sheetData: any = {
    data: sheet.getData(),
  };
  // Create a callback which the component can call in order to make changes the document and then be notified once those changes are done
  const updateCallback = async (property: string, value: any) => {
    // update document
    await sheet.document.update({ [property]: value }, { render: false });
    // update data on sheetData
    sheetData.data = sheet.getData();
    // Tell svelte to check its props again so that it will realize that "data" was externally updated by foundry
    // @ts-ignore
    app.$$.update();
  };
  sheetData.update = updateCallback;
  const target = html.find("form")[0];
  // @ts-ignore
  app = new svelteComponent({
    target: target,
    props: {
      sheetData,
    },
  });
  return app;
}
