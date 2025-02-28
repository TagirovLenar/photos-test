import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const usePhotoStore = defineStore("photoStore", () => {
  const photos = ref([]); 
  const loading = ref(false); 
  const albumFilter = ref(""); 
  const limit = ref(30); 


  const filteredPhotos = computed(() => {
    if (!albumFilter.value) return photos.value.slice(0, limit.value);
    const albumIds = albumFilter.value.split(" ").map(Number).filter(Boolean);
    return photos.value
      .filter((photo) => albumIds.includes(photo.albumId))
      .slice(0, limit.value);
  });


  const fetchPhotos = async () => {
    loading.value = true;
    try {
      let url = "https://jsonplaceholder.typicode.com/photos";
      

      if (albumFilter.value) {
        const albumIds = albumFilter.value
          .split(" ")
          .map((id) => `albumId=${id}`)
          .join("&");
        url += `?${albumIds}`;
      }
  

      const { data } = await axios.get(url);
      photos.value = data;
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      loading.value = false;
    }
  };
  

  const loadMore = () => {
    if (limit.value < photos.value.length) {
      limit.value += 20;
    }
  };

  return {
    photos,
    loading,
    albumFilter,
    filteredPhotos,
    fetchPhotos,
    loadMore,
  };
});
