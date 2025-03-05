<template>
  <AppLayout>
    <h1>Team</h1>
    <div class="q-pa-md">
      <q-layout view="hHh lpR fFf">
        <q-page-container>
          <q-page class="q-pa-md">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">Dan</div>
                <div class="text-subtitle2">Founder, CEO</div>
              </q-card-section>
            </q-card>
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">MaskedBandit</div>
                <div class="text-subtitle2">co-Founder, CSO</div>
              </q-card-section>
            </q-card>
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-h6">Shout out to ChatGPT and Claude</div>
              </q-card-section>
            </q-card>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../components/AppLayout.vue';
</script>

<style scoped>
.q-mb-md {
  margin-bottom: 16px;
}
</style>
