import type { Database } from "./supabase";
export type Fact = Database["public"]["Tables"]["facts"]["Row"];
export type FactInsert = Database["public"]["Tables"]["facts"]["Insert"];
export type Sorting = "newest" | "popularity" | null;
export type Category = "all" | "technology" | "science" | "finance" | "society" | "entertainment" | "health" | "history" | "news";
