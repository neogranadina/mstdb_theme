<script>
    import { DocumentStore } from '$lib/browse-store'
    import { onMount } from 'svelte';

    onMount(async function () {
        if (!$DocumentStore.length) {
            const endpoint = 'http://localhost:81/mdb/api/documentos/'
            const response = await fetch(endpoint)
            const data =  await response.json()
            console.log(data)
            DocumentStore.set(data)
        }
    })

</script>

<div>
    <ul>
        {#each $DocumentStore as documento}
            <li>{ documento.titulo }</li>
        {/each}
    </ul>
</div>