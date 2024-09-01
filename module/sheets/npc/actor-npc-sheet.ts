import FormApp from "./actor-npc-sheet.svelte";

export class DaggerheartNPCSheet extends ActorSheet {
  // Injects Svelte app when initializing HTML
  async _injectHTML(html: JQuery) {
    await super._injectHTML(html);
    // @ts-ignore
    this.app = new FormApp({
      target: html.find("form")[0],
      props: {
        sheetData: this.getData(),
      },
    });
  }

  // Injects Svelte app when replacing innerHTML
  async _replaceHTML(element: JQuery, html: JQuery) {
    await super._replaceHTML(element, html);
    // @ts-ignore
    this.app = new FormApp({
      target: html.find("form")[0],
      props: {
        sheetData: this.getData(),
      },
    });
  }

  /** @override */
  static get defaultOptions() {
    const options = foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["daggerheart", "sheet", "actor"],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "features",
        },
      ],
    });
    return options;
  }

  /** @override */
  get template() {
    return `systems/daggerheart/templates/actor/actor-npc-sheet.hbs`;
  }
}
