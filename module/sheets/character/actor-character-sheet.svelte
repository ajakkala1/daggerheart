<script lang="ts">
    import Resource from '../shared-components/resource.svelte'
    import Level from '../shared-components/level-indicator.svelte'
    export let sheetData
    const { actor, system, documentRef } = sheetData
    function poop (schemaName: string, value: number) {
        console.log('update', schemaName, value)
        actor.update({[schemaName]: value})
    }
    $: hpValue = system.hitpoints.value
    $: hpMax = system.hitpoints.max
    function updateHp(event: CustomEvent<{ value: number }>) {
        documentRef.update({'system.hitpoints.value': event.detail.value})
    }
</script>

<!-- Sheet Header -->
<header class="sheet-header bg-base-100 text-neutral-100">
    <img alt="profile" class="profile-img" src="{actor.img}" data-edit="img" title="{actor.name}" height="100" width="100"/>
    <div class="header-fields">
        <h1 class="charname">
            <input name="name" type="text" value="{actor.name}" placeholder="Name"/>
        </h1>
        <div class="resources grid grid-3col">
            <Resource label="HP" value="{hpValue}" max="{hpMax}" on:update={updateHp}/>
            <Resource label="STRESS" value="{system.stress.value}" max="{system.stress.max}" on:update={event => documentRef.update({'system.stress.value': event.detail.value})}/>
            <Resource label="ARMOR" value="{system.armor.value}" max="{system.armor.max}" on:update={event => documentRef.update({'system.armor.value': event.detail.value})}/>
            <Resource label="HOPE" value="{system.hope.value}" max="{system.hope.max}" on:update={event => documentRef.update({'system.hope.value': event.detail.value})}/>

            <div class="resource flex-group-center">
                <Level levelSchema="{system.attributes.level}"/>
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