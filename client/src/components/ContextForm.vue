<template>
  <van-collapse v-model="activeNames">
    <van-collapse-item title="补充更多信息，生成更精准的借口" name="context">
      <van-cell-group inset>
        <van-field v-model="form.myRole" label="我的身份" placeholder="如：普通员工" maxlength="50" />
        <van-field v-model="form.targetRole" label="对方身份" placeholder="如：直属领导" maxlength="50" />

        <van-cell title="关系亲密度">
          <van-slider v-model="form.closeness" :min="1" :max="5" :step="1" />
          <template #label>
            <span class="closeness-label">{{ closenessText }}</span>
          </template>
        </van-cell>

        <van-cell title="拒绝对象">
          <van-radio-group v-model="form.targetCount" direction="horizontal">
            <van-radio name="single">单人</van-radio>
            <van-radio name="multiple">多人</van-radio>
          </van-radio-group>
        </van-cell>

        <van-field v-model="form.time" label="时间" placeholder="如：今晚、下周六" maxlength="50" />
        <van-field v-model="form.place" label="地点" placeholder="如：公司、老家" maxlength="50" />

        <van-cell title="拒绝方式">
          <van-radio-group v-model="form.channel" direction="horizontal">
            <van-radio name="face">面对面</van-radio>
            <van-radio name="wechat">微信</van-radio>
            <van-radio name="phone">电话</van-radio>
          </van-radio-group>
        </van-cell>

        <van-cell title="语气偏好">
          <van-radio-group v-model="form.tone" direction="horizontal">
            <van-radio name="formal">正式</van-radio>
            <van-radio name="casual">日常</van-radio>
            <van-radio name="relaxed">轻松</van-radio>
          </van-radio-group>
        </van-cell>

        <van-field v-model="form.extra" label="补充" type="textarea" rows="2" placeholder="其他想补充的信息..." maxlength="50" />
      </van-cell-group>
    </van-collapse-item>
  </van-collapse>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { ExcuseContext } from '../types';

const activeNames = ref<string[]>([]);

const form = reactive<ExcuseContext>({
  myRole: '',
  targetRole: '',
  closeness: 3,
  targetCount: 'single',
  time: '',
  place: '',
  channel: 'wechat',
  tone: 'casual',
  extra: '',
});

const closenessLabels = ['', '陌生人', '一般认识', '普通朋友', '好朋友', '亲密关系'];
const closenessText = computed(() => `${form.closeness}/5 - ${closenessLabels[form.closeness || 3]}`);

function getContext(): ExcuseContext {
  // 只返回有值的字段
  const result: ExcuseContext = {};
  if (form.myRole) result.myRole = form.myRole;
  if (form.targetRole) result.targetRole = form.targetRole;
  if (form.closeness !== 3) result.closeness = form.closeness;
  if (form.targetCount) result.targetCount = form.targetCount;
  if (form.time) result.time = form.time;
  if (form.place) result.place = form.place;
  if (form.channel) result.channel = form.channel;
  if (form.tone) result.tone = form.tone;
  if (form.extra) result.extra = form.extra;
  return result;
}

function setContext(context: Partial<ExcuseContext>) {
  Object.assign(form, context);
  if (!activeNames.value.includes('context')) {
    activeNames.value.push('context');
  }
}

defineExpose({ getContext, setContext });
</script>

<style scoped>
.closeness-label {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
