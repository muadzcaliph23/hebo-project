import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { prisma } from "./db";

const app = new Elysia()
  .use(cors())
  .post("/api/models", async ({ body }: any) => {
    const post = await prisma.post.create({
      data: body, // already parsed JSON
    });
    console.log("Created:", post);
    return post;
  })
  .put("/api/models", async ({ body }: any) => {
    const update = await prisma.post.update({
      where: { id: body.id },
      data: body,
    });
    console.log("Updated:", update);
    return update;
  })
  .delete("/api/models", async ({ body }: any) => {
    const deleted = await prisma.post.delete({
      where: { id: body.id },
    });
    console.log("Deleted:", deleted);
    return deleted;
  })
  .get("/api/models", async () => {
    return prisma.post.findMany();
  })
  .listen(3000);

console.log(`🦊 Elysia running at http://localhost:3000`);
