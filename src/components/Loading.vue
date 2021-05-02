<!--
    White overlay with animated spinner to show when data is being fetched from the API
-->
<template>
    <div class="loader">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-spin">
            <path d="m256 0c-139 0-253 111-256 250 3-121 95-218 208-218 115 0 208 100 208 224 0 26 22 48 48 48 26 0 48-22 48-48 0-141-115-256-256-256z m0 512c139 0 253-111 256-250-3 121-95 218-208 218-115 0-208-100-208-224 0-26-22-48-48-48-26 0-48 22-48 48 0 141 115 256 256 256z"></path>
        </svg>
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style scoped>
    .loader {
        width:100%;
        height:100%;
        position:fixed;
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
        z-index:1000;
        background:rgba(255, 255, 255, 0.75);
    }
    svg {
        width:4rem;
        height:4rem;
    }
    .icon-spin {
        animation: icon-spin 1.2s infinite linear;
    }
    @keyframes icon-spin {
        0% {
            transform: rotate(0deg) scale(1);
        }
        50% {
            transform: rotate(180deg) scale(1.2);
        }
        100% {
            transform: rotate(359deg) scale(1);
        }
    }
</style>
