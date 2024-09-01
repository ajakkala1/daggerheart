// Import document classes.
import { DaggerheartActor } from "./documents/actor.js";
import { DaggerheartItem } from "./documents/item.js";
// Import sheet classes.
import { DaggerheartActorSheet } from "./sheets/actor-sheet.js";
import { DaggerheartItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { DAGGERHEART } from "./helpers/config.mjs";
// Import DataModel classes
import * as models from "./data/_module.mjs";
import DaggerheartDomainCard from "./data/item-domainCard.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  // TODO extend Game type to include daggerheart property
  (game as any).daggerheart = {
    DaggerheartActor,
    DaggerheartItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  // TODO extend CONFIG type to include DAGGERHEART
  (CONFIG as any).DAGGERHEART = DAGGERHEART;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @abilities.dex.mod",
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = DaggerheartActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  // TODO figure out why dataModels is not on type Actor or Item
  (CONFIG.Actor as any).dataModels = {
    character: models.DaggerheartCharacter,
    npc: models.DaggerheartNPC,
  };
  CONFIG.Item.documentClass = DaggerheartItem;
  (CONFIG.Item as any).dataModels = {
    item: models.DaggerheartItem,
    feature: models.DaggerheartFeature,
    spell: models.DaggerheartSpell,
    domainCard: models.DaggerheartDomainCard,
  };

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  (CONFIG.ActiveEffect as any).legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("daggerheart", DaggerheartActorSheet, {
    makeDefault: true,
    label: "DAGGERHEART.SheetLabels.Actor",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("daggerheart", DaggerheartItemSheet, {
    makeDefault: true,
    label: "DAGGERHEART.SheetLabels.Item",
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data: any, slot: number) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes("Actor.") && !data.uuid.includes("Token.")) {
    return ui.notifications?.warn(
      "You can only create macro buttons for owned Items",
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.daggerheart.rollItemMacro("${data.uuid}");`;
  let macro = (game as Game).macros?.find(
    (m) => m.name === item?.name && (m as any).command === command,
  );
  if (!macro) {
    macro = await Macro.create({
      name: item?.name ?? "Nameless Macro",
      type: "script",
      img: item?.img,
      command: command,
      flags: { "daggerheart.itemMacro": true },
    });
  }
  await (game as Game).user?.assignHotbarMacro(macro ?? null, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid: string) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: "Item",
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData as any).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications?.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`,
      );
    }

    // Trigger the item roll
    (item as DaggerheartItem).roll();
  });
}
