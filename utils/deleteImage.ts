import { imagekit } from "@/lib/imagekit";

export async function deleteImageFromImagekit(fileId: string) {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting from ImageKit:", error);
    return {
      success: false,
      message: `Error deleting image with FileID => ${fileId}`,
    };
  }
}
