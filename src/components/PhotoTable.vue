<script setup>
import { ref, computed, onMounted } from "vue";
import { usePhotoStore } from "../stores/photos";

const store = usePhotoStore();
const sortKey = ref(null);
const sortOrder = ref(1); 
const loading = ref(true); 

const sortedPhotos = computed(() => {
  if (!sortKey.value) return store.filteredPhotos;
  return [...store.filteredPhotos].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    return (valA > valB ? 1 : -1) * sortOrder.value;
  });
});

const sortTable = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
};

const onScroll = (event) => {
  const { target } = event;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    store.loadMore();
  }
};

onMounted(async () => {
  await store.fetchPhotos();
  loading.value = false; 
});
</script>

<template>
  <div class="w-[600px] max-h-[600px] overflow-auto border rounded shadow mx-auto" @scroll="onScroll">
    <table class="w-full border-collapse">
      <thead class="bg-gray-200 sticky top-0">
        <tr>
          <th class="p-2 cursor-pointer w-[50px]" @click="sortTable('id')">
            ID
            <span v-if="sortKey === 'id'">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
          </th>
          <th class="p-2 cursor-pointer w-[100px]" @click="sortTable('albumId')">
            Альбом
            <span v-if="sortKey === 'albumId'">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
          </th>
          <th class="p-2 cursor-pointer w-[200px]" @click="sortTable('title')">
            Название
            <span v-if="sortKey === 'title'">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
          </th>
          <th class="p-2 w-[100px]">Ссылка</th>
          <th class="p-2 w-[100px]">Миниатюра</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">

          <tr v-for="n in 10" :key="n" class="animate-pulse border-b">
            <td class="p-2 text-center">
              <div class="h-4 bg-gray-300 rounded w-8 mx-auto"></div>
            </td>
            <td class="p-2 text-center">
              <div class="h-4 bg-gray-300 rounded w-12 mx-auto"></div>
            </td>
            <td class="p-2 text-center">
              <div class="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
            </td>
            <td class="p-2 text-center">
              <div class="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </td>
            <td class="p-2 flex justify-center items-center">
              <div class="w-10 h-10 bg-gray-300 rounded"></div>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr v-for="photo in sortedPhotos" :key="photo.id" class="border-b">
            <td class="p-2 text-center">{{ photo.id }}</td>
            <td class="p-2 text-center">{{ photo.albumId }}</td>
            <td class="p-2 text-center truncate max-w-[150px]" :title="photo.title">
              {{ photo.title }}
            </td>
            <td class="p-2 text-center">
              <a :href="photo.url" target="_blank" class="text-blue-500 underline">Открыть</a>
            </td>
            <td class="p-2 flex justify-center items-center">
              <img :src="photo.thumbnailUrl" :alt="photo.title" class="w-10 h-10 rounded" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
