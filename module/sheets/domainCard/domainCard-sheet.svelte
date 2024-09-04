<script lang="ts">
    export let sheetData
    const { item, system } = sheetData
    const domain: string = "blade";
    const Domain: string = domain[0].toUpperCase() + domain.slice(1);
    $: level = system.cardLevel.value;
    let textColor: string;
    $: {
        if (domain == ("bone" || "splendor")) textColor = "black";
        else textColor = "white";
    }

    $: cardType = "Level"

</script>

<!--<header class="sheet-header">-->
<!--    <div class="top">-->
<!--        <h1 class="cardLevel">Card Level {system.cardLevel.value}</h1>-->
<!--    </div>-->
<!--</header>-->
<div class="card">
    <div class="background relative" style="height: 230px; width: 300px;">
        <img src="systems/daggerheart/assets/cards/backgrounds/{domain}-background.jpg" alt="{Domain} Background" style="object-fit: cover; height: unset; border: unset"/>
        <div class="absolute top-0 left-2" style="height: 114px; width: 60px;">
            <img src="systems/daggerheart/assets/cards/banners/{domain}-banner.webp" alt="{Domain} Banner" style="object-fit: cover; height: unset; border: unset">
        </div>
        <div class="level absolute top-[32px]" style="left: 32px;">
            <div class="font-extrabold text-xl" style="color:{textColor};">{level}</div>
        </div>
    </div>
    <div class="divider relative" style="height: 40px; width: 300px;">
        <img src="systems/daggerheart/assets/cards/dividers/{domain}-divider.webp" alt="{Domain} Divider" style="object-fit: cover; height: unset; border: unset">
        <div class="card-type absolute top-[3px] text-[11px] w-full" style=" color:{textColor};">
            <div class="font-extrabold text-center w-full">{cardType}</div>
        </div>
    </div>
    <div class="card-body" style="height: 200px; width: 300px;">
        <h2 class="card-title text-center">{Domain} Domain</h2>
    </div>
</div>
