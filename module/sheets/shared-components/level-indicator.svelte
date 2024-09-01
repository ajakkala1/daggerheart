<script lang="ts">
    export let levelSchema: {value: number}
</script>

<div class="w-[66px] h-[80px] level-bg flex flex-col relative mx-2 my-4">
    <img src="systems/daggerheart/assets/level-bg.webp" style="object-fit: cover; height: unset; border: unset">
    <div class="absolute text-black z-50 bottom-8 right-[30px]">
        <div class="font-extrabold text-xl">{levelSchema.value}</div>
    </div>
    <div class="relative bottom-[23px] left-[2px]">
        <div class="w-14 h-[18px] bg-black border rounded-[6px] text-white text-xs font-extrabold" style="border-color: #f3c267">LEVEL</div>
    </div>
</div>