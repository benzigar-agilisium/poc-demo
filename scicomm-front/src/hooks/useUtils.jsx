import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = "https://xygciufrmqfymscbvyqi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z2NpdWZybXFmeW1zY2J2eXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNjMwMzIsImV4cCI6MjA0MjgzOTAzMn0.Y2X3mYs2l-zA_vFYZFbw5wR4gYfDVYKh8NQokJEgp5k";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useUtils() {
  const uploadFileToSupabase = async (file) => {
    try {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from("public-bucket")
        .upload("public/" + fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log(data);

      if (error) {
        throw new Error(error.message);
      }

      const publicData = supabase.storage
        .from("public-bucket")
        .getPublicUrl("public/" + fileName);

      return publicData?.data?.publicUrl;
    } catch (error) {
      console.error("Error uploading file to Supabase:", error);
      throw error;
    }
  };

  return {
    uploadFileToSupabase,
  };
}
