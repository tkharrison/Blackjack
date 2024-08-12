import { DrawCardResp } from "@/types/DrawCardResp";

export async function createDecks() {
  try {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/");
    if (!res?.ok) throw new Error("Failed to create deck");
    const data = await res?.json();
    if (!data || !data.success) throw new Error("Failed to create deck");
    return data.deck_id;
  } catch (e) {
    console.error(e);
  }
}

export async function drawCard(
  num: number,
  deckId?: string
): Promise<DrawCardResp> {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId ? deckId : "new"}/draw/?count=${num}`
  );

  const data = await res.json();

  if (!data || !data.success) {
    throw new Error("Failed to draw card");
  }

  return data;
}

export async function shuffleDeck(deckId?: string): Promise<DrawCardResp> {
  const res = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
  );

  const data = await res.json();

  if (!data || !data.success || !data.shuffled) {
    throw new Error("Failed to shuffle cards");
  }

  return data;
}
