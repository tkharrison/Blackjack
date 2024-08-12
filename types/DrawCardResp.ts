import { CardData } from "./CardData";

export interface DrawCardResp {
  success: string;
  deck_id: string;
  cards?: CardData[];
}
