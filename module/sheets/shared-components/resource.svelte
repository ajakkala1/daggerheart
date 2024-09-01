<script>
    export let label = '';
    export let value = 0;
    export let maxValue = 0;
</script>

<div class="flex flex-col">
    <label for="system.hitpoints.value" class="resource-label">{label}</label>
    <div class="resource-content flex flex-row items-center space-between flex-grow flex-wrap">
<!--        <input type="text" name="system.hitpoints.value" value="{value}" data-dtype="Number"/>-->
<!--        <span> / </span>-->
<!--        <input type="text" name="system.hitpoints.max" value="{maxValue}" data-dtype="Number"/>-->
        <button class="daisy-btn daisy-btn-circle daisy-btn-outline">
            -
        </button>
        {#each {length: maxValue} as _, i}
            <input type="checkbox" class="daisy-checkbox daisy-checkbox-sm"/>
        {/each}
        <button class="daisy-btn daisy-btn-circle daisy-btn-outline">
            +
        </button>
    </div>
</div>