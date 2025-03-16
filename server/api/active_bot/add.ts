import { botinfo, changeBotInfo } from "~/server/cache/botinfo";
export default defineEventHandler((event) => {
  changeBotInfo({
    id: "e08e4493-be14-400a-b8c9-f111c1ba6df4",
    name: "asd_asd_asd",
    time: 1738579256429,
  });
  return { ...botinfo };
});
