import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DaggerheartActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['daggerheart', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/daggerheart/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.DAGGERHEART
    context.config = CONFIG.DAGGERHEART;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
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
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    console.log('_onRoll', event)
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label} Check` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      let messageData = {
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      }
      if (dataset.rollType && dataset.rollType === 'duality') {
        const result = await roll.evaluate();
        console.log('result', result)
        const rollResult = this.getDualityResult(result)
        messageData.content = this.buildTemplateFromDualityResult({...rollResult, label: dataset.label})
        ChatMessage.create(messageData)
      } else {
        roll.toMessage(messageData);
      }
      return roll;
    }
  }

  getDualityResult(rollResult) {
    const hope = rollResult.terms.find(term => term.options.flavor === 'hope').results[0].result
    const fear = rollResult.terms.find(term => term.options.flavor === 'fear').results[0].result
    const total = rollResult.total
    const mod = total - hope - fear
    return {hope, fear, total, mod}
  }

  buildTemplateFromDualityResult({hope, fear, total, mod, label}) {
    const withHopeStr = game.i18n.localize('DAGGERHEART.RollResults.WithHope')
    const withFearStr = game.i18n.localize('DAGGERHEART.RollResults.WithFear')
    const criticalStr = game.i18n.localize('DAGGERHEART.RollResults.Critical')
    let resultMessage;
    let resultColor;
    let textColor;
    let border;
    if (hope > fear) {
      resultMessage = `${total} ${withHopeStr}`
      resultColor = '#B0D7FF'
      textColor = '#000000'
      border = '1px solid black'
    } else if (hope < fear) {
      resultMessage = `${total} ${withFearStr}`
      resultColor = '#2D3142'
      textColor = '#FFFFFF'
      border = '1px solid black'
    } else {
      resultMessage = `${total} ${criticalStr}`
      resultColor = '#5863F8'
      textColor = '#000000'
      border = '2px solid black'
    }

    let modStr = ''
    if (mod > 0) {
      modStr = `+ ${mod}`
    } else if (mod < 0) {
      modStr = `- ${mod}`
    } else {
      modStr = '0'
    }

    return `
      <div class="message-content">
        <div class="dice-roll">
          <div class="dice-result">
            <h4 class="dice-formula" style="
              background-color: ${resultColor}; 
              color: ${textColor}; 
              border: ${border};
              font-size: 1.25rem;
              font-weight: bold;
            ">
              ${resultMessage}
            </h4>
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>Hope</span>
                    <ol class="dice-rolls">
                      <li class="roll die d12">${hope}</li>
                    </ol>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>Fear</span>
                    <ol class="dice-rolls">
                      <li class="roll die d12">${fear}</li>
                    </ol>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>${label}</span>
                    <ol class="dice-rolls">
                      <li class="roll die d6">${modStr}</li>
                    </ol>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
