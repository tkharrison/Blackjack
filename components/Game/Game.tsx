import { useState, useEffect } from "react";
import { CardData } from "@/types/CardData";
import { drawCard, shuffleDeck } from "@/api";
import Hand from "@/components/Hand/Hand";
import { calcTotal } from "@/components/Hand/Hand";
import Modal from "@/components/Modal/Modal";
import styles from "./styles.module.css";
import { useCallback } from "react";

export default function Game() {
  const [houseHand, setHouseHand] = useState<CardData[]>([]);
  const [userHand, setUserHand] = useState<CardData[]>([]);
  const [deckId, setDeckId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userWins, setUserWins] = useState<boolean>(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState<boolean>(false);

  async function drawCards() {
    try {
      setIsLoading(true);
      let res = deckId ? await drawCard(4, deckId) : await drawCard(4);
      res.deck_id && setDeckId(res.deck_id);
      if (res.cards) {
        setHouseHand(res.cards.slice(0, 2));
        setUserHand(res.cards.slice(2, 4));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await drawCards();
    })();
  }, []);

  function setLoseModal() {
    setUserWins(false);
    setShowOutcomeModal(true);
  }

  function setWinModal() {
    setUserWins(true);
    setShowOutcomeModal(true);
  }

  async function handleHit() {
    try {
      const res = await drawCard(1, deckId);
      const nextCard = res?.cards?.[0];
      nextCard &&
        setUserHand((currCards) => {
          const newHand = [nextCard, ...(currCards || [])];
          const userTotal = calcTotal(newHand);
          if (userTotal > 21) setLoseModal();
          if (userTotal === 21) setWinModal();
          return newHand;
        });
    } catch (e) {
      console.error(e);
    }
  }

  const resetGame = useCallback(() => {
    setHouseHand([]);
    setUserHand([]);
    setUserWins(false);
    setShowOutcomeModal(false);
  }, []);

  async function handleReplay() {
    try {
      resetGame();
      await shuffleDeck(deckId);
      await drawCards();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStay() {
    const userTotal = calcTotal(userHand);
    const houseTotal = calcTotal(houseHand);
    if (userTotal === 21 && houseTotal !== 21) {
      setWinModal();
      return;
    }
    if (userTotal < 21 && userTotal > houseTotal) {
      setWinModal();
      return;
    }
    if (userTotal < 21 && userTotal < houseTotal) {
      setLoseModal();
      return;
    }
    if (userTotal === houseTotal) {
      setLoseModal();
      return;
    }
  }

  return (
    <div className={styles.gameContainer}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.handsContainer}>
          <div className={styles.handContainer}>
            {houseHand && <Hand cards={houseHand} isHouse={true} />}
          </div>
          <div className={styles.handContainer}>
            {userHand && <Hand cards={userHand} isHouse={false} />}
          </div>
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton} onClick={handleHit}>
          Hit
        </button>
        <button className={styles.actionButton} onClick={handleStay}>
          Stand
        </button>
      </div>
      <Modal
        title={userWins ? "Congratulations!" : "Sorry, you lost this one"}
        isOpen={showOutcomeModal}
      >
        <p className={styles.modalSubtitle}>
          {userWins ? "You won this round!" : "Better luck next time!"}
        </p>
        <button className={styles.playAgainButton} onClick={handleReplay}>
          Play Again
        </button>
      </Modal>
    </div>
  );
}
