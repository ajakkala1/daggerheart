<script lang="ts">
    import Resource from '../shared-components/resource.svelte'
    import Indicator from '../shared-components/indicator.svelte'
    export let props: any
    $: data = props.data
    const update = props.update
    $: actor = data.actor
    $: system = data.system
    $: roll = data.roll as (forumla: string, label: string) => void
</script>

<!-- Sheet Header -->
<header class="flex flex-col w-full bg-base-100 text-neutral-100 p-2">

    <!-- Top row contains profile pic, name, class, ancestry, community, downtime button, conditions, and level -->
    <div class="flex flex-row justify-between w-full">

        <!-- Left side of first row -->
        <div class="flex">

            <!-- Profile pic container  -->
            <div class="rounded-full border m-4 h-16 w-16" style="border-color: #f3c267">
                <img class="daggerheart-img border rounded-full h-16 w-16" style="border-color: #f3c267" alt="profile" src="{actor.img}" data-edit="img" title="{actor.name}"/>
            </div>

            <!-- Character details (name, class, ancestry, community, subclass) -->
            <div class="flex flex-col justify-center">
                <div class="text-white font-extrabold text-xl">
                    <input class="daggerheart-input" type="text" placeholder="Name" value="{actor.name}" on:input={async e => {
                    // @ts-ignore
                    const updatedName = e.target.value
                    console.log('updating actor name ', updatedName)
                    update('name', updatedName)
                }}/>
                </div>
                <div class="flex flex-row">
                <span class="font-bold text-sm" style="color: #f3c267">
                    SEABORNE RIBBET SORCERER &nbsp;
                </span>
                    <span class="text-sm text-white">
                    (PRIMAL ORIGIN)
                </span>
                </div>
            </div>

        </div>

        <!-- Right side of first row -->
        <div class="flex flex-row">
            <Indicator type="level" label="LEVEL" value="{system.attributes.level.value}"/>
        </div>
    </div>

    <!-- Second row contains evasion, armor, armor slots, and the 6 main ability scores -->
    <div class="flex flex-row">
        <Indicator type="evasion" label="EVASION" value="{system.evasionScore.value}"/>
        <Indicator type="armor" label="ARMOR" value="{system.armorScore.value}"/>
        <Resource label="ARMOR SLOTS" value="{system.armor.value}" max="{system.armor.max}" on:update={event => update('system.armor.value', event.detail.value)}/>
        <Indicator label="AGILITY" value="{system.abilities.agility.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.agility.mod", "Agility")}/>
        <Indicator label="STRENGTH" value="{system.abilities.strength.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.strength.mod", "Strength")}/>
        <Indicator label="FINESSE" value="{system.abilities.finesse.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.finesse.mod", "Finesse")}/>
        <Indicator label="INSTINCT" value="{system.abilities.instinct.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.instinct.mod", "Instinct")}/>
        <Indicator label="PRESENCE" value="{system.abilities.presence.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.presence.mod", "Presence")}/>
        <Indicator label="KNOWLEDGE" value="{system.abilities.knowledge.value}"
                   on:click={e => roll("1d12[hope]+1d12[fear]+@abilities.knowledge.mod", "Knowledge")}/>
    </div>


    <div class="flex flex-row">
        <div class="resources grid grid-3col">
            <Resource label="HP" value="{system.hitpoints.value}" max="{system.hitpoints.max}" on:update={event => update('system.hitpoints.value', event.detail.value)}/>
            <Resource label="STRESS" value="{system.stress.value}" max="{system.stress.max}" on:update={event => update('system.stress.value', event.detail.value)}/>

            <Resource label="HOPE" value="{system.hope.value}" max="{system.hope.max}" on:update={event => update('system.hope.value', event.detail.value)}/>

            <div class="resource flex-group-center">

            </div>
        </div>
        <div class="abilities flex flex-row">
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.agility.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.agility.mod" data-label="Agility">Agility</label>
                <input type="text" name="system.abilities.agility.value" value="{system.abilities.agility.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.agility.mod" data-label="Agility">{system.abilities.agility.value}</span>
            </div>
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.strength.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.strength.mod" data-label="Strength">Strength</label>
                <input type="text" name="system.abilities.strength.value" value="{system.abilities.strength.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.strength.mod" data-label="Strength">{system.abilities.strength.value}</span>
            </div>
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.finesse.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.finesse.mod" data-label="Finesse">Finesse</label>
                <input type="text" name="system.abilities.finesse.value" value="{system.abilities.finesse.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.finesse.mod" data-label="Finesse">{system.abilities.finesse.value}</span>
            </div>
        </div>
        <div class="abilities flex flex-row">
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.instinct.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.instinct.mod" data-label="Instinct">Instinct</label>
                <input type="text" name="system.abilities.instinct.value" value="{system.abilities.instinct.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.instinct.mod" data-label="Instinct">{system.abilities.instinct.value}</span>
            </div>
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.presence.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.presence.mod" data-label="Presence">Presence</label>
                <input type="text" name="system.abilities.presence.value" value="{system.abilities.presence.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.presence.mod" data-label="Presence">{system.abilities.presence.value}</span>
            </div>
            <div class="ability flexrow flex-group-center">
                <label for="system.abilities.knowledge.value" class="resource-label rollable flexlarge align-left" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.knowledge.mod" data-label="Knowledge">Knowledge</label>
                <input type="text" name="system.abilities.knowledge.value" value="{system.abilities.knowledge.value}" data-dtype="Number"/>
                <span class="ability-mod rollable" data-roll-type="duality" data-roll="1d12[hope]+1d12[fear]+@abilities.knowledge.mod" data-label="Knowledge">{system.abilities.knowledge.value}</span>
            </div>
        </div>
    </div>
</header>

<!-- Sheet Tab Navigation -->
<nav class="sheet-tabs tabs" data-group="primary">
    <!-- Default tab is set in actor-sheet -->
    <a class="item" data-tab="features">Features</a>
    <a class="item" data-tab="description">Description</a>
    <a class="item" data-tab="items">Items</a>
    <a class="item" data-tab="spells">Spells</a>
    <a class="item" data-tab="effects">Effects</a>
</nav>

<!-- Sheet Body -->
<section class="sheet-body">

    <!-- Features Tab -->
    <div class="tab features" data-group="primary" data-tab="features">
        <section class="grid grid-3col">
            <aside class="sidebar">
            </aside>

            <!-- Main features spans 2 tabs -->
            <section class="main grid-span-2">
                <!-- TODO migrate actor-features.hbs to a svelte component -->
                <!-- {{> "systems/daggerheart/templates/actor/parts/actor-features.hbs"}}-->
            </section>

        </section>
    </div>

    <!-- Bio Tab -->
    <div class="tab biography" data-group="primary" data-tab="description">
    <!-- TODO Don't know how to do this fancy enrichedBio stuff now that we're using svelte components -->
    <!--{editor enrichedBiography target="system.biography" engine="prosemirror" button=true editable=editable}-->
    </div>

    <!-- Items Tab -->
    <div class="tab items" data-group="primary" data-tab="items">
        <!-- TODO migrate actor-item.hbs to a svelte component -->
        <!--{> "systems/daggerheart/templates/actor/parts/actor-items.hbs"}-->
    </div>

    <!-- Spells Tab -->
    <div class="tab spells" data-group="primary" data-tab="spells">
        <!-- TODO migrate actor-spells.hbs to a svelte component -->
        <!--{> "systems/daggerheart/templates/actor/parts/actor-spells.hbs"}-->
    </div>

    <!-- Active Effects Tab -->
    <div class="tab effects flexcol" data-group="primary" data-tab="effects">
        <!-- TODO migrate actor-effects.hbs to a svelte component -->
        <!--{{> "systems/daggerheart/templates/actor/parts/actor-effects.hbs"}}-->
    </div>

</section>