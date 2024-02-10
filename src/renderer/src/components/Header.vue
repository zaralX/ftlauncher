<script setup lang="ts">

const exitHandle = () => window["electron"].ipcRenderer.send('exit')
const minimizeHandle = () => window["electron"].ipcRenderer.send('minimize')
</script>

<template>
  <div class="w-full bg-themeFourth h-10">
    <div class="flex items-center h-full">
      <div class="select-none ml-2 w-full draggable h-full flex items-center">
        <div class="text-2xl font-semibold bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 text-transparent bg-clip-text bg-500% animate-gradient">FTLauncher</div>
      </div>
      <div class="ml-auto mr-0 h-full select-none">
        <div class="flex items-center h-full">
          <button class="h-full flex justify-center items-center px-4 hover:bg-themeSecondary" @click="minimizeHandle">_</button>
          <button class="h-full flex justify-center items-center px-4 hover:bg-themeSecondary" @click="exitHandle">X</button>
        </div>
      </div>
    </div>
  </div>
</template>
