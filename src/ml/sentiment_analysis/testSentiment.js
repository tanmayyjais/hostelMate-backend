import axios from "axios";

const test = async () => {
   try {
      const response = await axios.post("http://192.168.137.117:8000/analyze", {
         text: "The toilet flush is broken again.",
      });
      console.log("Sentiment:", response.data);
   } catch (error) {
      console.error("FAILED:", error.message);
   }
};

test();
