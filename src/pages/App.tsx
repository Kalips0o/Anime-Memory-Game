import React, { useEffect, useState } from "react";
import {
  Container,
  LogoContainer,
  CardsContainer,
  Logo,
  ContainerButton,
  Button
} from "./App.styles";
import logo from "../assets/img/logo.png";
import totoro from "../assets/img/totoro.png";

import { createBoard } from "../Utils/setup";
import { shuffleArray } from "../Utils/utils";

import { CardType } from "../Utils/setup";
import Card from "../Card/Card";

const App = () => {
  const timeout = 1000;
  const [cards, setCards] = useState<CardType[]>(shuffleArray(createBoard()));
  const [gameWon, setGameWon] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [clickedCard, setClickedCard] = useState<undefined | CardType>(
      undefined
  );

  useEffect(
      () => {
        if (matchedPairs === cards.length / 2) {
          setGameWon(true);
        }
      },
      [matchedPairs]
  );

  function refreshPage() {
    window.location.reload();
  }

  const handleCardClick = (currentClickedCard: CardType) => {
    //Virar carta
    setCards(prev =>
        prev.map(
            card =>
                card.id === currentClickedCard.id
                    ? { ...card, flipped: true, clickable: false }
                    : card
        )
    );
    // Se for a primeira carta virada, permanecer com ela virada
    if (!clickedCard) {
      setClickedCard({ ...currentClickedCard });
      return;
    }

    //Checar se a carta corresponde ao seu par
    if (
        clickedCard.matchingCardId === currentClickedCard.id ||
        clickedCard.id === currentClickedCard.matchingCardId
    ) {
      setMatchedPairs(prev => prev + 1);
      setCards(prev =>
          prev.map(
              card =>
                  card.id === clickedCard.id || card.id === currentClickedCard.id
                      ? { ...card, clickable: false }
                      : card
          )
      );
      setClickedCard(undefined);
      return;
    }

    // Se nao for o par correto
    setTimeout(() => {
      setCards(prev =>
          prev.map(
              card =>
                  card.id === clickedCard.id || card.id === currentClickedCard.id
                      ? { ...card, flipped: false, clickable: true }
                      : card
          )
      );
    }, 1000);

    setClickedCard(undefined);
  };

  return (
      <Container>
        <LogoContainer>
          <Logo src={logo} alt="logo" />
          {gameWon &&
          <ContainerButton>
            <img src={totoro} alt="totoro" />
            <Button type="submit" onClick={refreshPage}>
              New game
            </Button>
          </ContainerButton>}
        </LogoContainer>
        <CardsContainer>
          {cards.map(card =>
              <Card key={card.id} callback={handleCardClick} card={card} />
          )}
        </CardsContainer>
      </Container>
  );
};

export default App;
