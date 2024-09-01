<script>
    export let sheetData
    const { item, system } = sheetData
</script>

<header class="sheet-header">
    <div class="top">
        <h1 class="cardLevel">Card Level {system.cardLevel.value}</h1>
    </div>
</header>
<div class="card bg-base-100 width: 300 shadow-xl">
    <figure>
        <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
    </figure>
    <div class="card-body">
        <h2 class="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div class="card-actions justify-end">
            <button class="btn btn-primary">Buy Now</button>
        </div>
    </div>
</div>
