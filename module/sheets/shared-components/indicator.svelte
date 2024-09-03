<script lang="ts">
    export let value: number = 0
    export let label: string = ''
    export let type: 'level' | 'evasion' | 'armor' | 'ability' = 'ability'
    let imgSrc = ''
    if (type === 'level') {
        imgSrc = 'systems/daggerheart/assets/level-bg.webp'
    } else if (type === 'armor') {
        imgSrc = 'systems/daggerheart/assets/dh-armor-bg.webp'
    } else if (type === 'evasion') {
        imgSrc = 'systems/daggerheart/assets/dh-evasion-bg.webp'
    } else {
        imgSrc = 'systems/daggerheart/assets/stat-box-bg.webp'
    }
    let displayValue: string
    if (type === 'ability') {
        if (value >= 0) {
            displayValue = '+' + value
        } else {
            displayValue = '-' + value
        }
    } else {
        displayValue = value.toString()
    }
    let offset: string = '';
    if (type === "level") {
        offset = 'translate: 0px 8px;'
    }
    if (type === 'ability') {
        offset = 'translate: 0px -55px;'
    }
</script>

<div class="w-[66px] h-[80px] block mx-2 my-4" style="background-size: contain; background-repeat: no-repeat; background-image: url({imgSrc})">
<!--    <img src="{imgSrc}" style="object-fit: cover; height: unset; border: unset">-->
    <div class="h-full w-full flex flex-col items-center justify-center text-black z-50">
        <div class="font-extrabold text-xl text-center">{displayValue}</div>
        <div class="h-[18px] bg-black border rounded-[6px] text-white text-xs font-extrabold text-center"
             style="border-color: #f3c267; padding: 1px 4px 16px 4px; {offset}">
            {label}
        </div>
    </div>
</div>