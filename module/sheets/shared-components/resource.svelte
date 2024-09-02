<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let label: string;
    export let value: number;
    export let max: number;
    const dispatch = createEventDispatcher<Record<'update', {value: number}>>()
    function increment() {
        dispatch('update', {value: value + 1})
    }
    function decrement() {
        dispatch('update', {value: value - 1})
    }
</script>

<div class="flex flex-col bg-black rounded-xl w-[268px]">
    <div class="flex flex-row flex-grow justify-between px-4 my-1">
        <label class="font-bold">{label}</label>
        <label class="font-light text-xs text-accent">{value}/{max} MARKED</label>
    </div>

    <div class="flex flex-row items-center space-between flex-grow flex-wrap px-2 my-1">
        <button class="daisy-btn daisy-btn-circle daisy-btn-xs daisy-btn-outline mx-[5px] my-[3px]" on:click={decrement}>
            -
        </button>
        {#each {length: max} as _, i}
            <input type="checkbox" on:click|preventDefault class="daisy-checkbox daisy-checkbox-sm cursor-default" checked={value > i}/>
        {/each}
        <button class="daisy-btn daisy-btn-circle daisy-btn-xs daisy-btn-outline mx-[5px] my-[3px]" on:click={increment}>
            +
        </button>
    </div>
</div>