import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../helpers/effects.mjs";
import {
  getDualityResult,
  buildTemplateFromDualityResult,
} from "../../helpers/dualityRoll.mjs";
import FormApp from "./domainCard-sheet.svelte";
import { DaggerheartItem } from "../../documents/item.js";

export class DaggerheartDomainCardSheet extends ItemSheet {
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
      width: 320,
      height: 520,
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
    return `systems/daggerheart/templates/item/item-domainCard-sheet.hbs`;
  }

  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData() as any;

    // Use a safe clone of the item data for further operations.
    const itemData = (this.document as any).toPlainObject();

    // Add the item's data to context.data for easier access, as well as flags.
    context.item = itemData;
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Adding a pointer to CONFIG.DAGGERHEART
    // @ts-ignore
    context.config = CONFIG.DAGGERHEART;

    return context;
  }
}
