<script>
    import ArcsMap from './viz/ArcsMap.svelte';
  
    let activeView = 'arcs-map';
  </script>
  
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="display-5 mb-0">Dashboard</h1>
          <nav>
            <button 
              class="btn btn-outline-primary"
              class:active={activeView === 'arcs-map'}
              on:click={() => activeView = 'arcs-map'}
            >
              <i class="bi bi-map me-2"></i>Mostrar trayectorias
            </button>
            <!-- More buttons for future views -->
          </nav>
        </div>
      </div>
    </div>
  
    <main class="row">
      <div class="col">
        {#if activeView === 'arcs-map'}
          <ArcsMap />
        {/if}
      </div>
    </main>
  </div>
  
  <style>
    .btn-outline-primary.active {
      background-color: var(--bs-primary);
      color: white;
    }
    
    .btn-outline-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
  