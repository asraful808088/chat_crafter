import { getActivityBot } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  try {
    return { item: getActivityBot() };
  } catch (error) {}
  return {};
});
