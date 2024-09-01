import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../helpers/effects.mjs";
import {
  getDualityResult,
  buildTemplateFromDualityResult,
} from "../../helpers/dualityRoll.mjs";
import FormApp from "../character/actor-character-sheet.svelte";
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
}
