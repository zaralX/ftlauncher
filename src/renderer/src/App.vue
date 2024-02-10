<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import {ref} from "vue";
const launchDisabled = ref(false);
const nickname = ref('');

const launchHandle = () => {
  if (nickname.value?.value.length < 3) {
    return;
  }
  launchDisabled.value = true;
  window["electron"].ipcRenderer.send('launch', {nickname: nickname.value?.value})
}
const updateHandle = () => {
  launchDisabled.value = true;
  window["electron"].ipcRenderer.send('launch', {nickname: nickname.value?.value})
}
const downloadLog = ref("[НИКАКОЙ]");
window.api.onDownloadLog((data) => {
  downloadLog.value = data;
})
const loadStatus = ref("[НИКАКОЙ]");
window.api.onLoadStatus((data) => {
  if (data["type"] == "error") {
    launchDisabled.value = false;
  }
  loadStatus.value = data;
})
window.api.onLoadNickname((data) => {
  console.log("123")
  nickname.value.value = data;
})

</script>

<template>
  <div class="text-themeText font-medium">
    <Header />
    <div class="w-full">
      <div class="flex justify-center items-center flex-col">
        <div class="my-6">
          <p class="text-sm">Никнейм</p>
          <input :disabled="launchDisabled" class="bg-themeFourth p-2 rounded-lg focus:outline-0 transition-all duration-100 focus:bg-themeFifth" ref="nickname" placeholder="Введите ник" minlength="3" maxlength="16">
        </div>
        <div class="w-1/3 rounded-md bg-themeFourth shadow-lg h-[50vh] overflow-hidden">
          <div class="text-2xl font-semibold text-center opacity-90">TechnoMagic</div>
          <div class="flex justify-center items-center h-full flex-col">
            <button :disabled="launchDisabled" class="w-2/3 aspect-square p-8 bg-green-600 font-semibold text-3xl rounded-full disabled:opacity-50 shadow-lg" @click="launchHandle">Играть</button>
            <div class="text-lg font-semibold opacity-75 text-themeInfo my-1">Заходи к нам!)</div>
            <button :disabled="launchDisabled" class="w-full bg-themeInfo font-semibold text-3xl rounded-lg opacity-75 disabled:opacity-50 shadow-lg" @click="updateHandle">Переустановить</button>
          </div>
        </div>
      </div>
      <div class="w-full h-[17vh] px-12 mt-8">
        <div class="bg-themeFourth shadow-lg rounded-md h-full p-4 flex flex-col">
          <div class="text-2xl">Майним биткоины</div>
          <div class="text-md"><p class="opacity-75">Статус: <span :class="loadStatus['type'] == 'success' ? 'text-themeSuccess' : loadStatus['type'] == 'error' ? 'text-themeDanger' : 'text-themeInfo'">{{loadStatus["message"]}}</span></p></div>
          <div class="text-md"><p class="opacity-75">Закачиваем файлик: <span class="text-themeInfo">{{(downloadLog["path"]?.length > 50 ? '...' : '') + (downloadLog["path"]?.slice(downloadLog["path"]?.length > 50 ? downloadLog["path"]?.length-50 : 0))}}</span></p></div>
          <div class="h-[2vh] w-full bg-themeFifth rounded-full mt-auto mb-0">
            <div class="h-full bg-themeInfo rounded-full mt-auto mb-0 transition-all delay-100" :style="`width: ${Math.ceil(downloadLog['current']/downloadLog['total']*100)}%;`"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
