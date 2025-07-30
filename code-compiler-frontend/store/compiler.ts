// src/store/languageStore.ts
import { create } from "zustand";
import axios from "axios";

interface Languages {
  id: number;
  name: string;
}

interface LanguageStore {
  language: Languages[];
  fetchLanguages: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: [],
  fetchLanguages: async () => {
    try {
      const response = await axios.get<Languages[]>("http://localhost:3001/api/compiler/languages");
      set({ language: response.data });
    } catch (error) {
      console.error("Failed to fetch languages from Judge0 API", error);
    }
  },
  submitCode:async(code:string,languageId:number) => {
    try {
      const response = await axios.post("http://localhost:3001/api/compiler/run", {
        source_code: code,
        language_id: languageId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to submit code to Judge0 API", error);
      throw error;
    }
  }
}))
