<script setup>
import { ref, watch } from "vue";
import { usePhotoStore } from "../stores/photos";

const store = usePhotoStore();
const albumInput = ref(""); 


watch(albumInput, (newValue) => {
  if (newValue.trim() === "") {
    searchPhotos()
  }
});


const searchPhotos = () => {
  store.albumFilter = albumInput.value.trim();
  store.fetchPhotos(); 
};
</script>

<template>
  <header class="max-w-[600px] flex items-center gap-4 p-4 bg-gray-100 shadow">
    <input
      v-model="albumInput"
      type="text"
      placeholder="Введите ID альбомов (1 2 3)"
      class="p-2 border rounded w-64"
    />
    <button @click="searchPhotos" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Поиск
    </button>
  </header>
</template>
