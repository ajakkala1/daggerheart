import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../helpers/effects.mjs";
import {
  getDualityResult,
  buildTemplateFromDualityResult,
} from "../../helpers/dualityRoll.mjs";
import FormApp from "./actor-character-sheet.svelte";
import { DaggerheartItem } from "../../documents/item.js";
import { injectSvelteComponent } from "../utils/svelte-helpers.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DaggerheartActorSheet extends ActorSheet {
  // Injects Svelte app when initializing HTML
  async _injectHTML(html: JQuery) {
    await super._injectHTML(html);
    injectSvelteComponent(this, FormApp, html);
  }

  // Injects Svelte app when replacing innerHTML
  async _replaceHTML(element: JQuery, html: JQuery) {
    await super._injectHTML(html);
    injectSvelteComponent(this, FormApp, html);
  }

  /** @override */
  static get defaultOptions() {
    const options = foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["daggerheart", "sheet", "actor"],
      width: 900,
      height: 900,
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
    return `systems/daggerheart/templates/actor/actor-character-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData() as any;

    // Use a safe clone of the actor data for further operations.
    const actorData = (this.document as any).toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.actor = actorData;
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.documentHolder = this;

    // Adding a pointer to CONFIG.DAGGERHEART
    // @ts-ignore
    context.config = CONFIG.DAGGERHEART;

    // Prepare character data and items.
    if (actorData.type == "character") {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == "npc") {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    // context.enrichedBiography = await TextEditor.enrichHTML(
    //   this.actor.system.biography,
    //   {
    //     // Whether to show secret blocks in the finished html
    //     secrets: this.document.isOwner,
    //     // Necessary in v11, can be removed in v12
    //     async: true,
    //     // Data to fill in for inline rolls
    //     rollData: this.actor.getRollData(),
    //     // Relative UUID resolution
    //     relativeTo: this.actor,
    //   },
    // );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      (this.actor as any).allApplicableEffects(),
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context: any) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context: any) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const domainCards = {
      Arcana: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Blade: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Bone: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Codex: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Grace: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Midnight: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Sage: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Splendor: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
      Valor: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
      },
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || (Item as any).DEFAULT_ICON;
      // Append to gear.
      if (i.type === "item") {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === "feature") {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === "domainCard") {
        if (
          i.system.cardLevel !== undefined ||
          i.system.domainName !== undefined
        ) {
          // @ts-ignore
          domainCards[i.system.domainName][i.system.cardLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.domainCards = domainCards;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on("click", ".item-edit", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item?.sheet?.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on("click", ".item-create", this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on("click", ".item-delete", (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item?.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on("click", ".effect-control", (ev) => {
      const row = ev.currentTarget.closest("li");
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      // @ts-ignore
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on("click", ".rollable", this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      // @ts-ignore
      let handler = (ev) => this._onDragStart(ev);
      html.find("li.item").each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true as any);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event: Event | any) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event: any) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == "item") {
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId) as DaggerheartItem;
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label} Check` : "";
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      let messageData = {
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: (game as Game).settings.get("core", "rollMode"),
        content: undefined as string | undefined,
      };
      if (dataset.rollType && dataset.rollType === "duality") {
        const result = await roll.evaluate();
        const rollResult = getDualityResult(result);
        messageData.content = buildTemplateFromDualityResult({
          ...rollResult,
          label: dataset.label,
        });
        ChatMessage.create(messageData);
      } else {
        roll.toMessage(messageData);
      }
      return roll;
    }
  }
}
