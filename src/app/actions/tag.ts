"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany();
    return { tags };
  } catch (error) {
    return { error, message: "Failed to fetch tags" };
  }
}

export async function createTag(formData: FormData) {
  try {
    const name = formData.get("name") as string;

    const tag = await prisma.tag.create({
      data: { name },
    });

    revalidatePath("/");
    return { tag };
  } catch (error) {
    return { error, message: "Failed to create tag" };
  }
}

export async function updateTag(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;

    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
    });

    revalidatePath("/");
    return { tag };
  } catch (error) {
    return { error, message: "Failed to update tag" };
  }
}

export async function deleteTag(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);

    await prisma.tag.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error, message: "Failed to delete tag" };
  }
}
