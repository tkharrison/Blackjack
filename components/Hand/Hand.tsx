import { CardData } from "@/types/CardData";
import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

interface HandProps {
  cards: CardData[];
  isHouse: boolean;
}

export function calcTotal(cards: CardData[]): number {
  let total = 0;
  let aceCount = 0;

  cards.forEach((card) => {
    if (["JACK", "QUEEN", "KING"].includes(card?.value)) {
      total += 10;
    } else if (card?.value === "ACE") {
      aceCount++;
      total += 1; // Add 1 for each Ace initially
    } else {
      total += parseInt(card?.value);
    }
  });

  // Adjust total for Aces if it improves the score
  while (aceCount > 0 && total + 10 <= 21) {
    total += 10;
    aceCount--;
  }

  return total;
}

export const Hand: React.FC<HandProps> = ({ cards, isHouse }) => {
  const total = calcTotal(cards);
  return (
    <div className={styles.handWrapper}>
      <div className={styles.cardsContainer}>
        {cards.map((card, i) => (
          <div key={i} className={styles.cardWrapper}>
            <Image
              src={card?.images?.png}
              alt="card pic"
              layout="fill"
              objectFit="contain"
            />
            {i === 0 && (
              <div
                className={`${styles.badge} ${isHouse ? styles.houseBadge : styles.playerBadge}`}
              >
                {isHouse ? "House" : "Player"}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.totalBadge}>{total}</div>
    </div>
  );
};

export default Hand;
