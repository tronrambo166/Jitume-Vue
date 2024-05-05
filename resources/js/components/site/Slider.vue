<!-- Slider.vue -->
<template>
  <agile :items="items" class="agile">
    <template #default="{ item }">
      <div class="slide">
        <div class="card">
          <img :src="item.image" alt="Card Image" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </template>
  </agile>
</template>

<script>
import { ref } from 'vue';
import { useAgile } from 'vue-agile';

export default {
  setup() {
    const items = ref([
      { title: 'Card 1', description: 'Description for Card 1', image: 'https://via.placeholder.com/150' },
      { title: 'Card 2', description: 'Description for Card 2', image: 'https://via.placeholder.com/150' },
      { title: 'Card 3', description: 'Description for Card 3', image: 'https://via.placeholder.com/150' },
      { title: 'Card 4', description: 'Description for Card 4', image: 'https://via.placeholder.com/150' },
      { title: 'Card 5', description: 'Description for Card 5', image: 'https://via.placeholder.com/150' }
    ]);
    useAgile();

    return { items };
  }
};
</script>

<style scoped>
.agile {
  /* Add styles for the slider container */
}

.slide {
  /* Add styles for individual slides */
}

.card {
  /* Add styles for the card */
}

.card-img-top {
  /* Add styles for the card image */
}

.card-body {
  /* Add styles for the card body */
}

.card-title {
  /* Add styles for the card title */
}

.card-text {
  /* Add styles for the card text */
}
</style>
