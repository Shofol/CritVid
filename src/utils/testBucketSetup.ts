import { DANCE_CRITIQUES_BUCKET } from "../lib/storage";
import { supabase } from "../lib/supabase";

export async function testBucketSetup() {
  console.log("🧪 Testing bucket setup for:", DANCE_CRITIQUES_BUCKET);

  try {
    // 1. Check if bucket exists
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("❌ Error fetching buckets:", bucketsError);
      return false;
    }

    const bucketExists = buckets.some((b) => b.id === DANCE_CRITIQUES_BUCKET);
    console.log("🪣 Bucket exists:", bucketExists);
    console.log(
      "📋 Available buckets:",
      buckets.map((b) => b.id)
    );

    if (!bucketExists) {
      console.error("❌ dance-critiques bucket does not exist!");
      return false;
    }

    // 2. Test upload with a small test blob
    const testBlob = new Blob(["test"], { type: "text/plain" });
    const testFileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
      .from(DANCE_CRITIQUES_BUCKET)
      .upload(testFileName, testBlob);

    if (error) {
      console.error("❌ Upload test failed:", error);
      return false;
    }

    console.log("✅ Upload test successful:", data.path);

    // 3. Clean up test file
    const { error: deleteError } = await supabase.storage
      .from(DANCE_CRITIQUES_BUCKET)
      .remove([testFileName]);

    if (deleteError) {
      console.warn("⚠️ Could not delete test file:", deleteError);
    } else {
      console.log("🧹 Test file cleaned up");
    }

    return true;
  } catch (error) {
    console.error("❌ Bucket test failed:", error);
    return false;
  }
}

// Function to call from browser console
(window as any).testBucketSetup = testBucketSetup;
